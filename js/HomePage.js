let employeePayrollList;
window.addEventListener('DOMContentLoaded', () => {
    employeePayrollList = getEmployeePayrollDataFromStorage();
    document.querySelector('.emp-count').textContent = employeePayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
});

//Displaying the employee payroll data in tabular format
const createInnerHtml = () => {

    const headerHtml = "<tr><th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>StartDate</th><th>Actions</th></tr>";
    if(employeePayrollList.length == 0){
        let innerHTML = `${headerHtml}`;
        document.querySelector('#table-display').innerHTML = innerHTML;
        return;
    } 
    let innerHtml = `${headerHtml}`;
    for(const empPayrollData of employeePayrollList){
        innerHtml = `${innerHtml}
        <tr> 
            <td><img class = "profile" src = "${empPayrollData._profilePic}"" alt = ""></td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>${getDeptHtml(empPayrollData._department)}</td>
            <td>${empPayrollData._salary}</td>
            <td>${stringifyDate(empPayrollData._startDate)}</td>
            <td>
                <img id = "${empPayrollData._id}" src = "../assets/icons/delete-black-18dp.svg" onclick = "remove(this)" alt = "delete">
                <img id = "${empPayrollData._id}" src = "../assets/icons/create-black-18dp.svg" onclick = "update(this)" alt = "edit">
            </td>
        </tr>
        `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml;
}
const getDeptHtml = (deptList) => {
    let deptHtml =``;
    for (const dept of deptList){
        deptHtml = `${deptHtml}<div class = "dept-label">${dept}</div>`;
    }
    return deptHtml;
}

//Retreiving data from local storage
const getEmployeePayrollDataFromStorage = () =>{
    return localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
}

//Performing the delete operations
const remove = (node) => {
    console.log(employeePayrollList);
    let employeePayrollData = employeePayrollList.find(empData => empData._id == node.id);
    if(!employeePayrollData) return;
    const index = employeePayrollList.map(empData => empData._id).indexOf(employeePayrollData._id);
    employeePayrollList.splice(index, 1);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
    document.querySelector(".emp-count").textContent = employeePayrollList.length;
    createInnerHtml();
}

const update = (node) =>{
    let employeePayrollData = employeePayrollList.find(empData => empData._id == node.id);
    if(!employeePayrollData) return;
    localStorage.setItem('editEmp', JSON.stringify(employeePayrollData));
    window.location.replace("../pages/EmployeePayroll.html");
}

const stringifyDate = (date) => {
    const options = {year: "numeric", month: "short", day: "numeric"};
    const newDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString("en-GB", options);
    return newDate;
} 