
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExpenseTracker.Model
{
    public class CategoryModel
    {
        [Key]
        public int CategoryId { get; set; }

        [Column(TypeName ="varchar(10)")]
        public string CategoryName { get; set; }

        public int CategoryLimit { get; set; }

        //[JsonIgnore]
        //public List<ExpenseModel> ExpenseList { get; set; }
    }
}
