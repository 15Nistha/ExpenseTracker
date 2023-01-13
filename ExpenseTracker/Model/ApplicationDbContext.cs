using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Model
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<ExpenseModel> Expenses { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
    }
}
