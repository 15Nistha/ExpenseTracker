namespace ExpenseTracker.Model
{
    public class AddExpenseModel
    {


        public string ExpenseName { get; set; } = "Expense Name";



        public string? Description { get; set; } = "";

        public int CategoryId { get; set; } = 1;

        public int Amount { get; set; } = 100;

    }
}
