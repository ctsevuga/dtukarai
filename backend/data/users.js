import bcrypt from 'bcryptjs';

    const users = [
      {
        name: "Alice Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("Password123", 10),
        role: "admin",
        phone: "123-456-7890",
        address: "123 Admin Street",
      },
      {
        name: "Sam Supplier",
        email: "supplier@example.com",
        password: await bcrypt.hash("Password123", 10),
        role: "supplier",
        phone: "234-567-8901",
        address: "234 Supply Ave",
      },
      {
        name: "Danny Distributor",
        email: "distributor@example.com",
        password: await bcrypt.hash("Password123", 10),
        role: "distributor",
        phone: "345-678-9012",
        address: "345 Distribution Blvd",
      },
      {
        name: "Rachel Retailer",
        email: "retailer@example.com",
        password: await bcrypt.hash("Password123", 10),
        role: "retailer",
        phone: "456-789-0123",
        address: "456 Retail Road",
      },
      {
        name: "Leo Logistics",
        email: "logistics@example.com",
        password: await bcrypt.hash("Password123", 10),
        role: "logistics",
        phone: "567-890-1234",
        address: "567 Logistics Lane",
      },
      {
        name: "Ivy Inventory",
        email: "inventory@example.com",
        password: await bcrypt.hash("Password123", 10),
        role: "inventory_manager",
        phone: "678-901-2345",
        address: "678 Inventory Circle",
      },
    ];

export default users;
