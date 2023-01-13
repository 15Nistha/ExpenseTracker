const addButton=document.querySelector('#btnAdd');
const categoryNameInput=document.querySelector('#cnInput');
const categoryLimitInput=document.querySelector('#clInput');
const categoryContainer=document.querySelector('#categoryCon');
const edit=document.querySelectorAll('#edit');

//Category CRUD

function clearForm(){
	categoryNameInput.value="";
	categoryLimitInput.value=null;
	ExpenseNameInput="";
	DescriptionInput="";
	AmountInput=null;
}

var editdata=0;

function setFormData(id,name,limit) {
	        
    document.getElementById("cnInput").value= name;
     document.getElementById("clInput").value = limit;
}

function editCategoryCall(id) {

    // call get category details by id API
    fetch('http://localhost:5064/api/Category/'+id,{
        method:'GET'
    }).then((res)=>res.json()).then((response)=>{
        console.log("Edit info",response);
        editdata=response.categoryId;
        console.log("sddf"+editdata)
         var name=response.categoryName;
         var limit=response.categoryLimit;
         console.log(name+" "+limit+response.categoryId)
        setFormData(response.categoryId,response.categoryName,response.categoryLimit)
    })
}

function submitCategory() {
        if(editdata==0) addCategory(categoryNameInput.value,categoryLimitInput.value); // if the editFormData is undefined then call addCategory()
        else 
        	editCategory(editdata,categoryNameInput.value,categoryLimitInput.value);
}

function addCategory(CategoryName,CategoryLimit){
	
	const body = {
		categoryName: CategoryName,
		categoryLimit: CategoryLimit
	};

	fetch('http://localhost:5064/api/Category',{
		method:'POST',
		body: JSON.stringify(body),
		headers:{
			"content-type":"application/json"
		}
	})
	.then(data => data.json())
	// .then(response=> console.log(response));
	.then(response => {
		clearForm();
		getAllCategories();
		window.location.reload();
	});
}

function editCategory(id,name,limit) {
	
	const body={
		categoryName: name,
		categoryLimit: limit
	};

	fetch('http://localhost:5064/api/Category/'+id,{
		method:'PUT',
		body: JSON.stringify(body),
		headers:{
			"content-type":"application/json"
		}
	})
		.then(data => data.json())
	// .then(response=> console.log(response));
	.then(response => {
		clearForm();
		getAllCategories();
		window.location.reload();
	
	});
}

function deleteCategory(id){
	var result=confirm("Are you sure, you want to delete this?");
	if(result){
		fetch('http://localhost:5064/api/Category/'+id,{
			method:'DELETE'
		})
		.then(data=>data.json())
		.then(response => 
			getAllCategories())
	}	
}

function displayCategories(categories){
	
let allCategories="";
 	categories.map((xyz) => {

 		allCategories+=`
 			<tr id="${xyz.categoryId}">
 				<td onclick="return selectExpense(${xyz.categoryId})">${xyz.categoryName}</td>
				<td>${xyz.categoryLimit}</td>
 				<td>
 					<div class="d-flex flex-row justify-content-start">
                                             <a  
                                             class="btn btn-sm no-a-decoration pt-2" id="edit" class="edit"
                                              onclick="return editCategoryCall(${xyz.categoryId});">
                                                 <i class="fa-solid fa-pen-to-square" style="color:#000;"></i>
                                             </a>
                                           <form>
                                                                           
                                                 <button type="submit" class="btn btn-link no-a-decoration" 
                                                 onclick="return deleteCategory(${xyz.categoryId});
                                                 ">
                                                     <i class="fa-sharp fa-solid fa-trash text-danger"></i>
                                                  </button>
                                           </form>
                     </div>
				</td>
			</tr>
		`;
 	});
 	categoryContainer.innerHTML=allCategories;
}

function getAllCategories(){
	fetch('http://localhost:5064/api/Category')
	.then(data=>data.json())
	.then(response=> {
		displayCategories(response)
		SelectCategoryExpense(response)
	})	
}

getAllCategories();

function categoryValidation(){
	if(!categoryNameInput.checkValidity()){
		document.getElementById('nameAlert').innerHTML="*Required";
	}else{ document.getElementById('nameAlert').innerHTML="";}

	if(!categoryLimitInput.checkValidity()){
		document.getElementById('limitAlert').innerHTML="*Required";
	}else{ document.getElementById('limitAlert').innerHTML="";}

}

addButton.addEventListener('click',function(){
	categoryValidation();
});

console.log("storage"+typeof(Storage))
window.onbeforeunload=function(){
	if (typeof(Storage) !== "undefined") {
  // Store
  localStorage.setItem("amount",document.getElementById('totalexpenseimit').value);
  // Retrieve
    document.getElementById('totalexpenseimit').value=localStorage.getItem("amount");
} else {
  document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
}
}

window.onload=function(){
	var amount=localStorage.getItem("amount");
	if(amount!==null){
		document.getElementById('totalexpenseimit').value=amount;

	}
}
