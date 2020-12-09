let employeePayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    if(site_properties.use_local_storage.match("true")){
        getEmployeePayrollDataFromStorage();
    }else{
        getEmployeePayrollDataFromServer();
    }
});

//Retreiving data from local storage
const getEmployeePayrollDataFromStorage = () =>{
    employeePayrollList = localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}
const processEmployeePayrollDataResponse = () =>{
    document.querySelector(".emp-count").textContent = employeePayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromServer = () =>{
    makeServiceCall("GET", site_properties.server_url, true)
    .then(responseText => {
        employeePayrollList = JSON.parse(responseText);
        processEmployeePayrollDataResponse();
    })
    .catch(error => {
        console.log("Get Error status: "+JSON.stringify(error));
        employeePayrollList = [];
        processEmployeePayrollDataResponse();
    });
}

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
                <img id = "${empPayrollData.id}" src = "../assets/icons/delete-black-18dp.svg" onclick = "remove(this)" alt = "delete">
                <img id = "${empPayrollData.id}" src = "../assets/icons/create-black-18dp.svg" onclick = "update(this)" alt = "edit">
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

//Performing the delete operations
const remove = (node) => {
    console.log(employeePayrollList);
    let employeePayrollData = employeePayrollList.find(empData => empData.id == node.id);
    if(!employeePayrollData) return;
    const index = employeePayrollList.map(empData => empData.id).indexOf(employeePayrollData.id);
    employeePayrollList.splice(index, 1);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
    document.querySelector(".emp-count").textContent = employeePayrollList.length;
    createInnerHtml();
}

const update = (node) =>{
    let employeePayrollData = employeePayrollList.find(empData => empData.id == node.id);
    if(!employeePayrollData) return;
    localStorage.setItem('editEmp', JSON.stringify(employeePayrollData));
    window.location.replace("../pages/EmployeePayroll.html");
}

const stringifyDate = (date) => {
    const options = {year: "numeric", month: "short", day: "numeric"};
    const newDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString("en-GB", options);
    return newDate;
} 

function makeServiceCall(methodType, url, callback, async = true, data = null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            console.log("State Change called. Ready State : " + xhr.readyState + " Status :" + xhr.status);
            if (xhr.status.toString().match('^[2][0-9]{2}$')) {
                resolve(xhr.responseText);
            }
            else if (xhr.status.toString().match('^[4,5][0-9]{2}$')) {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
                console.log("XHR Failed");
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: XMLHttpRequest.statusText
            });
        };
        xhr.open(methodType, url, async);
        if (data) {
            console.log(JSON.stringify(data));
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        }
        else xhr.send();
        console.log(methodType + " request sent to the server");
    });
}