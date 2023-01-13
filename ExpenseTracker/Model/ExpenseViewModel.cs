using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Model
{
    public class ExpenseViewModel
    {
        [Key]
        public int ExpenseId { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string ExpenseName { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string? Description { get; set; }

        public int CategoryId { get; set; }

        public int Amount { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string CategoryName { get; set; }

        public int CategoryLimit { get; set; }
    }
}
