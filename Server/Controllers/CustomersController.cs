using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehiclePartsAPI.Data;
using VehiclePartsAPI.DTOs;
using VehiclePartsAPI.Models;
using System.Security.Claims;

namespace VehiclePartsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _db;

    public CustomersController(AppDbContext db) => _db = db;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string GetRole() => User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

    /// <summary>Staff/Admin: Search customers by name, phone, ID, or vehicle number</summary>
    [Authorize(Roles = "Admin,Staff")]
    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] string? search)
    {
        var query = _db.Customers.Include(c => c.User).Include(c => c.Vehicles).AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c =>
                c.User.FullName.Contains(search) ||
                c.User.Phone.Contains(search) ||
                c.Id.ToString() == search ||
                c.Vehicles.Any(v => v.VehicleNumber.Contains(search)));
        }

        var customers = await query
            .Select(c => new CustomerDto(
                c.Id, c.UserId, c.User.FullName, c.User.Email,
                c.User.Phone, c.Address, c.TotalSpent, c.PendingCredit, c.CreatedAt))
            .ToListAsync();
        return Ok(customers);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var c = await _db.Customers
            .Include(x => x.User)
            .Include(x => x.Vehicles)
            .Include(x => x.SaleInvoices).ThenInclude(s => s.Items).ThenInclude(i => i.Part)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (c == null) return NotFound();

        return Ok(new
        {
            Customer = new CustomerDto(c.Id, c.UserId, c.User.FullName, c.User.Email,
                c.User.Phone, c.Address, c.TotalSpent, c.PendingCredit, c.CreatedAt),
            Vehicles = c.Vehicles.Select(v => new VehicleDto(
                v.Id, v.CustomerId, v.VehicleNumber, v.Make,
                v.Model, v.Year, v.FuelType, v.Mileage, v.Condition)),
            PurchaseHistory = c.SaleInvoices.OrderByDescending(s => s.CreatedAt)
        });
    }

    /// <summary>Customer: Get own profile</summary>
    [HttpGet("me")]
    public async Task<ActionResult> GetMe()
    {
        var userId = GetUserId();
        var customer = await _db.Customers
            .Include(c => c.User)
            .Include(c => c.Vehicles)
            .FirstOrDefaultAsync(c => c.UserId == userId);
        if (customer == null) return NotFound();

        return Ok(new
        {
            Customer = new CustomerDto(
                customer.Id, customer.UserId, customer.User.FullName, customer.User.Email,
                customer.User.Phone, customer.Address, customer.TotalSpent,
                customer.PendingCredit, customer.CreatedAt),
            Vehicles = customer.Vehicles.Select(v => new VehicleDto(
                v.Id, v.CustomerId, v.VehicleNumber, v.Make,
                v.Model, v.Year, v.FuelType, v.Mileage, v.Condition))
        });
    }

    /// <summary>Staff: Register customer with vehicle details</summary>
    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<ActionResult> RegisterCustomer([FromBody] RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Email already exists." });

        var user = new User
        {
            FullName = req.FullName, Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Phone = req.Phone, Role = "Customer"
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var customer = new Customer { UserId = user.Id, Address = req.Address ?? string.Empty };
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
        
        // Return the created customer with user details
        var createdCustomer = await _db.Customers
            .Include(c => c.User)
            .FirstAsync(c => c.Id == customer.Id);
            
        return Ok(new CustomerDto(
            createdCustomer.Id, createdCustomer.UserId, createdCustomer.User.FullName, 
            createdCustomer.User.Email, createdCustomer.User.Phone, createdCustomer.Address,
            createdCustomer.TotalSpent, createdCustomer.PendingCredit, createdCustomer.CreatedAt));
    }

    /// <summary>Add vehicle to customer</summary>
    [HttpPost("{customerId}/vehicles")]
    public async Task<ActionResult> AddVehicle(int customerId, [FromBody] AddVehicleRequest req)
    {
        var customer = await _db.Customers.FindAsync(customerId);
        if (customer == null) return NotFound();

        if (await _db.Vehicles.AnyAsync(v => v.VehicleNumber == req.VehicleNumber))
            return Conflict(new { message = "Vehicle number already registered." });

        var vehicle = new Vehicle
        {
            CustomerId = customerId, VehicleNumber = req.VehicleNumber,
            Make = req.Make, Model = req.Model, Year = req.Year,
            FuelType = req.FuelType, Mileage = req.Mileage, Condition = req.Condition
        };
        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync();
        
        // Return the created vehicle as VehicleDto
        var createdVehicle = await _db.Vehicles.FirstAsync(v => v.Id == vehicle.Id);
        return Ok(new VehicleDto(
            createdVehicle.Id, createdVehicle.CustomerId, createdVehicle.VehicleNumber,
            createdVehicle.Make, createdVehicle.Model, createdVehicle.Year,
            createdVehicle.FuelType, createdVehicle.Mileage, createdVehicle.Condition));
    }

    /// <summary>Customer: View own purchase/service history</summary>
    [HttpGet("me/history")]
    public async Task<ActionResult> GetMyHistory()
    {
        var userId = GetUserId();
        var customer = await _db.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        if (customer == null) return NotFound();

        var invoices = await _db.SaleInvoices
            .Include(s => s.Items).ThenInclude(i => i.Part)
            .Where(s => s.CustomerId == customer.Id)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        var appointments = await _db.Appointments
            .Where(a => a.CustomerId == customer.Id)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return Ok(new { Invoices = invoices, Appointments = appointments });
    }
}
