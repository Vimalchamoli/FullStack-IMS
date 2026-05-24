import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Employee from "./models/Employee.js";
import bcrypt from 'bcrypt';
import { DEPARTMENTS } from "./constants/departments.js";

const dummyEmployees = [
    { firstName: "Alice", lastName: "Smith", email: "alice.smith@example.com", position: "Frontend Developer", department: "Engineering" },
    { firstName: "Bob", lastName: "Johnson", email: "bob.j@example.com", position: "Backend Developer", department: "Engineering" },
    { firstName: "Charlie", lastName: "Brown", email: "charlie.b@example.com", position: "HR Manager", department: "Human Resources" },
    { firstName: "Diana", lastName: "Prince", email: "diana.p@example.com", position: "Marketing Specialist", department: "Marketing" },
    { firstName: "Evan", lastName: "Wright", email: "evan.w@example.com", position: "Sales Executive", department: "Sales" },
    { firstName: "Fiona", lastName: "Gallagher", email: "fiona.g@example.com", position: "Financial Analyst", department: "Finance" },
    { firstName: "George", lastName: "Miller", email: "george.m@example.com", position: "Operations Manager", department: "Operations" },
    { firstName: "Hannah", lastName: "Abbott", email: "hannah.a@example.com", position: "IT Support Specialist", department: "IT Support" },
    { firstName: "Ian", lastName: "Malcolm", email: "ian.m@example.com", position: "Customer Success Manager", department: "Customer Success" },
    { firstName: "Julia", lastName: "Roberts", email: "julia.r@example.com", position: "Product Manager", department: "Product Management" },
    { firstName: "Kevin", lastName: "Hart", email: "kevin.h@example.com", position: "UI/UX Designer", department: "Design" }
];

async function seedEmployees() {
    try {
        await connectDB();

        const hashedPassword = await bcrypt.hash("password123", 10);
        let count = 0;

        for (const data of dummyEmployees) {
            const existingUser = await User.findOne({ email: data.email });
            if (!existingUser) {
                // Create user
                const user = await User.create({
                    email: data.email,
                    password: hashedPassword,
                    role: "EMPLOYEE"
                });

                // Create employee profile
                await Employee.create({
                    userId: user._id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: `555-010${count}`,
                    position: data.position,
                    department: data.department,
                    basicSalary: 50000 + (count * 2000),
                    allowances: 1000,
                    deductions: 500,
                    joinDate: new Date(),
                    bio: `Hello, I'm ${data.firstName} working in ${data.department}.`
                });

                count++;
                console.log(`Added employee: ${data.firstName} ${data.lastName}`);
            } else {
                console.log(`Skipped existing user: ${data.email}`);
            }
        }

        console.log(`Successfully added ${count} employees.`);
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed employees:", error);
        process.exit(1);
    }
}

seedEmployees();
