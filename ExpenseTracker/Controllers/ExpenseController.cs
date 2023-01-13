using ExpenseTracker.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : Controller
    {
        private readonly ApplicationDbContext _context;


        public ExpenseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetExpense()
        {
            var  expense= await (from expenses in _context.Expenses
                                 from category in _context.Categories
                                 where expenses.CategoryId == category.CategoryId
                                 select new ExpenseViewModel
                                 {
                                     ExpenseId = expenses.ExpenseId,
                                     ExpenseName = expenses.ExpenseName,
                                     Description = expenses.Description,
                                     CategoryId = expenses.CategoryId,
                                     CategoryName = category.CategoryName,
                                     CategoryLimit=category.CategoryLimit,
                                     Amount = expenses.Amount
                                 }).ToListAsync();



            return Ok(expense);
        }

        [HttpGet]
        [Route("{id:int}")]
        [ActionName("GetExpenseById")]
        public async Task<IActionResult> GetExpenseById([FromRoute] int id)
        {

            var expense = await (from expenses in _context.Expenses
                                                from category in _context.Categories
                                                where expenses.ExpenseId == id
                                                select new ExpenseViewModel
                                                {
                                                    ExpenseId = expenses.ExpenseId,
                                                    ExpenseName = expenses.ExpenseName,
                                                    Description = expenses.Description,
                                                    CategoryId = expenses.CategoryId,
                                                    CategoryName = category.CategoryName,
                                                    CategoryLimit = category.CategoryLimit,
                                                    Amount = expenses.Amount
                                                }).FirstOrDefaultAsync();

            if (expense == null)
            {
                return NotFound();
            }

            return Ok(expense);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense(AddExpenseModel expense)
        {
            var category = await _context.Categories.FindAsync(expense.CategoryId);
            if (category == null)
            {
                return NotFound();
            }

            var newExpense = new ExpenseModel {
                ExpenseName = expense.ExpenseName,
                Description = expense.Description,
                CategoryId = expense.CategoryId,
                Amount = expense.Amount
            };
                   
            _context.Expenses.Add(newExpense);

            
            await _context.SaveChangesAsync();

            return await GetExpenseById(newExpense.CategoryId);

        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateExpense([FromRoute] int id, [FromBody] AddExpenseModel updateExpense)
        {
            var existingExpense = await _context.Expenses.FindAsync(id);

            if (existingExpense == null)
            {
                return NotFound();
            }
            existingExpense.ExpenseName = updateExpense.ExpenseName;
            existingExpense.Description = updateExpense.Description;
            existingExpense.CategoryId = updateExpense.CategoryId;
            existingExpense.Amount = updateExpense.Amount;

            await _context.SaveChangesAsync();
            return Ok(existingExpense);

        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteExpense([FromRoute] int id)
        {
            var existingExpense = await _context.Expenses.FindAsync(id);
            if (existingExpense == null)
            {
                return NotFound();
            }
            _context.Expenses.Remove(existingExpense);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("SelectCategory/{id:int}")]
        public async Task<IActionResult> SelectCategory([FromRoute] int id)
        {
            var expense = await (from expenses in _context.Expenses
                                 from category in _context.Categories
                                 where expenses.CategoryId == id && category.CategoryId==id
                                 select new ExpenseViewModel                                 {
                                     ExpenseId = expenses.ExpenseId,
                                     ExpenseName = expenses.ExpenseName,
                                     Description = expenses.Description,
                                     CategoryId=category.CategoryId,
                                     CategoryName = category.CategoryName,
                                     Amount = expenses.Amount
                                 }).ToListAsync();



            return Ok(expense);
        }

        [HttpGet("TotalExpense/")]

        public async Task<int> TotalExpense()
        {
            var totalExpenseCount= _context.Expenses.Select(sum => sum.Amount).Sum();

            return totalExpenseCount;
        }

        [HttpGet]
        [Route("CheckLimit/{id:int}/{amount:int}")]
        public Boolean CheckLimit([FromRoute] int id,int amount)
        {
            var totalCategoryLimit =_context.Categories.Where(cid=>cid.CategoryId==id).Select(limit=>limit.CategoryLimit).FirstOrDefault();
            var expenseCategoryAmount = _context.Expenses.Sum(sum=>(sum.CategoryId==id?sum.Amount:0));

            var check =( totalCategoryLimit - expenseCategoryAmount >= amount ? true : false);

            return check;


        }

    }
}
