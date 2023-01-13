const enAddButton=document.querySelector('#enAddButton');
const ExpenseNameInput=document.querySelector('#enInput');
const DescriptionInput=document.querySelector('#edescInput');
const ExCategoryInput=document.querySelector('#select');
const AmountInput=document.querySelector('#amountInput');
const expenseContainer=document.querySelector('#expenseCon');
const exedit=document.querySelectorAll('#exedit');

//Expense CRUD

var exeditdata=0;

function submitExpense() {
	
		var x=document.getElementById('select').selectedIndex;
		var op1=document.getElementsByTagName("option")[x].value;
		console.log(op1);
		check(op1,exeditdata,ExpenseNameInput.value,DescriptionInput.value,AmountInput.value);
		async function check(id,exeditdata,ename,edesc,amount){

			const check=await fetch('http://localhost:5064/api/Expense/CheckLimit/'+id+'/'+amount);
			var data=await check.json();
				console.log("data"+ typeof data);
				
			if(data === true){
				if(exeditdata==0) {
        			addExpense(ename,edesc,id,amount)
        		} 
        		else{
        			editExpense(exeditdata,ename,edesc,id,amount);
        		} 
			}
			if(data === false){
				alert("Category Limit Exceeds!!");
			}
					
		}
}

function addExpense(ename,edesc,ecat,eamount){
	const body = {
		expenseName: ename,
		description: edesc,
		categoryId:ecat,
		amount:eamount
	};
	
	fetch('http://localhost:5064/api/Expense',{
		method:'POST',
		body: JSON.stringify(body),
		headers:{
			"content-type":"application/problem+json"
		}
	})
	.then(data => data.json())
	.then(response => {
		clearForm();
		getAllExpenses();
		window.location.reload();
	});
}

function editExpense(id,ename,edesc,ecat,eamount) {
	const body={
		expenseName: ename,
		description: edesc,
		categoryId:ecat,
		amount:eamount
	};

	fetch('http://localhost:5064/api/Expense/'+id,{
		method:'PUT',
		body: JSON.stringify(body),
		headers:{
			"content-type":"application/json"
		}
	})
		.then(data => data.json())
		.then(response => {
		clearForm();
		getAllExpenses();
		window.location.reload();			
	});
}


function setExpenseFormData(cid,id,name,description,amount) {
	        
    document.getElementById("enInput").value= name;
     document.getElementById("edescInput").value = description;
     document.getElementById("select").value = cid;
     document.getElementById("amountInput").value = amount;
}

function editExpenseCall(id) {

    // call get expense details by id API
    fetch('http://localhost:5064/api/Expense/'+id,{
        method:'GET'
    }).then((res)=>res.json()).then((response)=>{
        console.log("Edit info",response);
        exeditdata=response.expenseId;
        console.log("sddf"+exeditdata)
        setExpenseFormData(response.categoryId,exeditdata,response.expenseName,response.description,response.amount);
    })
}

function deleteExpense(id){
	var result=confirm("Are you sure, you want to delete this?");
	if(result){
			fetch('http://localhost:5064/api/Expense/'+id,{
				method:'DELETE'
			})
			.then(data=>data.json())
			.then(response => 
				getAllExpenses())	
	}
}

function displayExpenses(expenses){
	
let allExpense="";
 	expenses.map((xyz) => {

 		allExpense+=`
 			<tr>
 				<td>${xyz.expenseName}</td>
				<td>${xyz.description}</td>
				<td>${xyz.categoryName}</td>
				<td>${xyz.amount}</td>
 				<td>
 					<div class="d-flex flex-row justify-content-start">
                                             <a  
                                             class="btn btn-sm no-a-decoration pt-2" id="exedit" class="exedit"
                                              onclick="return editExpenseCall(${xyz.expenseId});
                                              ">
                                                 <i class="fa-solid fa-pen-to-square" style="color:#000;"></i>
                                             </a>
                                           <form>
                                                                           
                                                 <button type="submit" class="btn btn-link no-a-decoration" 
                                                  onclick="return deleteExpense(${xyz.expenseId});
                                                 ">
                                                     <i class="fa-sharp fa-solid fa-trash text-danger"></i>
                                                  </button>
                                           </form>
                     </div>
				</td>
			</tr>
		`;
 	});
 	expenseContainer.innerHTML=allExpense;
}

function getAllExpenses(){
	document.getElementById('selectall').style.visibility="hidden";
	fetch('http://localhost:5064/api/Expense')
	.then(data=>data.json())
	.then(response=> displayExpenses(response))	
}

getAllExpenses();
displayTotalExpenseAmount();

function displayTotalExpenseAmount(){

	fetch('http://localhost:5064/api/Expense/TotalExpense')
	.then(data=>data.json())
	.then(response=>{
		document.getElementById('totalexpenseamount').innerHTML= response;
		var amount=response;
		var totalamount=document.getElementById('totalexpenseimit').value;
		if(totalamount<amount){
			alert("Expense Amount is greater than Exepnse Limit!!");
		}
	})

}

function SelectCategoryExpense(response){
		let selectcat="";
		response.map(xyz=>{
			selectcat+=`
						<option id='exoption' value="${xyz.categoryId}">${xyz.categoryName}</option>`;
		})
		console.log(selectcat)
		ExCategoryInput.innerHTML=selectcat;
}


function selectExpense(id){
	document.getElementById('selectall').style.visibility="visible"

	fetch('http://localhost:5064/api/Expense/SelectCategory/'+id,{
		method:'GET'
	})
	.then(data=>data.json())
	.then(response=> displayExpenses(response))	

}

function expenseValidation() {
	if(!ExpenseNameInput.checkValidity()){
		document.getElementById('enameAlert').innerHTML="*Required";
	}else{ document.getElementById('enameAlert').innerHTML="";}
	
	if(!DescriptionInput.checkValidity()){
		document.getElementById('descAlert').innerHTML="*Required";
	}else{ document.getElementById('descAlert').innerHTML="";}
	
	if(!AmountInput.checkValidity()){
		document.getElementById('amountAlert').innerHTML="*Required";
	}else{ document.getElementById('amountAlert').innerHTML="";}
}

enAddButton.addEventListener('click',function(){
	expenseValidation();
});