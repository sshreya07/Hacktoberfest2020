let humans = [
    {
      name: "raj",
      age: 18,
      city: "banglore",
      salary: "180000"
    },
    {
        name: "ram",
        age: 19,
        city: "delhi",
        salary: "190000"
      },
      {
        name: "rishab",
        age: 20,
        city: "chennai",
        salary: "20000"
      },
      {
        name: "ritck",
        age: 21,
        city: "allahabad",
        salary: "210000"
      },
      {
        name: "ankit",
        age: 22,
        city: "banaras",
        salary: "220000"
      },]
      function display(humanarray) {
        let tabledata = "";
      
        humanarray.forEach(function (human, index) {
          let currentrow = `<tr>
          <td>${index + 1}</td>
          <td>${human.name}</td>
          <td>${human.age}</td>
          <td>${human.city}</td>
          <td>${human.salary}</td>
          <td>
          <button onclick='deletehuman(${index})'>delete</button>
          <button onclick='showModel(${index})'>update</button>
          </td>
          </tr>`;
      
          tabledata += currentrow;
        });
      
        document.getElementsByClassName("tdata")[0].innerHTML = tabledata;
        //   document.getElementById("tdata").innerHTML = tabledata;
      }
      
      display(humans);
      
      function addhuman(e) {
        e.preventDefault();
        let human = {};
        let name = document.getElementById("name").value;
        let age = document.getElementById("age").value;
        let city = document.getElementById("city").value;
        let salary = document.getElementById("salary").value;
       human .name = name;
       human.age = Number(age);
       human.city =city;
       human.salary= salary;
      
        humans.push(human);
      
        display(humans);
      
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("city").value = "";
        document.getElementById("salary").value = "";
      }
      
      function searchByName() {
        let searchValue = document.getElementById("searchName").value;
      
        let newdata = humans.filter(function (human) {
          return (
            human.name.toUpperCase().indexOf(searchValue.toUpperCase()) != -1
          );
        });
      
        display(newdata);
      }
      
      function deletehuman(index) {
        humans.splice(index, 1);
        display(humans);
      }
      
      let updateIndex;
      
      function copyhuman(index) {
        updateIndex = index;
        let human = humans[index];
      
        document.getElementById("upname").value =human.name;
        document.getElementById("upage").value = human.age;
        document.getElementById("upcity").value = human.planet;
        document.getElementById("upsalary").value =human.height;
      }
      
      function updatehuman(e) {
        e.preventDefault();
        let human = humans[updateIndex];
        console.log(human);
        let name = document.getElementById("upname").value;
        let age = document.getElementById("upage").value;
        let city = document.getElementById("upcity").value;
        let salary = document.getElementById("upsalary").value;
        human.name = name;
        human.age = Number(age);
        human.city = city;
        human.salary = salary;
        console.log(human);
      
        display(humans);
      
        // code for hiding from anywhere
        let modal = document.getElementsByClassName("modal")[0];
        modal.style.display = "none";
      }
      
      function showModal(index) {
        let modal = document.getElementsByClassName("modal")[0];
        modal.style.display = "block";
      
        copyhuman(index);
      }
      
      function hideModal(event) {
        if (event.target.className == "modal") {
          let modal = document.getElementsByClassName("modal")[0];
          modal.style.display = "none";
        }
      }