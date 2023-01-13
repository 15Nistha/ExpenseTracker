using ExpenseTracker.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;


        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategory()
        {
            return Ok(await _context.Categories.ToListAsync());
        }

        [HttpGet]
        [Route("{id:int}")]
        [ActionName("GetCategoryById")]
        public async Task<IActionResult> GetCategoryById([FromRoute] int id)
        {

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory(CategoryModel category)
        {
            category.CategoryId = new int();
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoryById), new {id=category.CategoryId},category);

        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateCategory([FromRoute] int id, [FromBody] CategoryModel updateCategory)
        {
            var existingCategory=await _context.Categories.FindAsync(id);

            if(existingCategory == null)
            {
                return NotFound();
            }
            existingCategory.CategoryName = updateCategory.CategoryName;
            existingCategory.CategoryLimit = updateCategory.CategoryLimit;

            await _context.SaveChangesAsync();
            return Ok(existingCategory);

        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int id)
        {
            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            _context.Categories.Remove(existingCategory);
            await _context.SaveChangesAsync();
            return Ok();
        }


    }
}
