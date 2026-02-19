let habits = JSON.parse(localStorage.getItem("habits")) || [];
let data = JSON.parse(localStorage.getItem("habitData")) || {};
let selectedHabit = habits[0] || null;

const habitList = document.getElementById("habitList");
const heatmap = document.getElementById("heatmap");

function save(){
    localStorage.setItem("habits",JSON.stringify(habits));
    localStorage.setItem("habitData",JSON.stringify(data));
}

function renderHabits(){
    habitList.innerHTML="";
    habits.forEach(h=>{
        const li=document.createElement("li");
        li.textContent=h;
        if(h===selectedHabit) li.classList.add("active");
        li.onclick=()=>{
            selectedHabit=h;
            renderHabits();
            renderHeatmap();
        };
        habitList.appendChild(li);
    });
}

document.getElementById("addHabit").onclick=()=>{
    const input=document.getElementById("habitInput");
    if(!input.value.trim()) return;
    habits.push(input.value.trim());
    selectedHabit=input.value.trim();
    input.value="";
    save();
    renderHabits();
    renderHeatmap();
};

function renderHeatmap(){
    heatmap.innerHTML="";
    if(!selectedHabit) return;

    for(let i=0;i<365;i++){
        const date=new Date();
        date.setDate(date.getDate()-i);
        const key=date.toISOString().split("T")[0];

        const div=document.createElement("div");
        div.className="day";

        let completed=data[selectedHabit]?.[key]||0;
        if(completed) div.classList.add("level3");

        div.onclick=()=>{
            if(!data[selectedHabit]) data[selectedHabit]={};
            data[selectedHabit][key]=!data[selectedHabit][key];
            save();
            renderHeatmap();
            calculateStats();
        };

        heatmap.prepend(div);
    }
}

function calculateStats(){
    if(!selectedHabit) return;
    const entries=Object.values(data[selectedHabit]||{}).filter(v=>v);
    const total=entries.length;

    document.getElementById("totalDays").textContent=total;

    let streak=0,longest=0;
    Object.keys(data[selectedHabit]||{}).sort().forEach(()=>{
        streak++;
        longest=Math.max(longest,streak);
    });

    document.getElementById("currentStreak").textContent=streak;
    document.getElementById("longestStreak").textContent=longest;

    let percent=Math.min(100,Math.round((total/365)*100));
    document.getElementById("completionPercent").textContent=percent+"%";
}

document.getElementById("themeToggle").onchange=(e)=>{
    document.body.classList.toggle("dark",e.target.checked);
    localStorage.setItem("theme",e.target.checked);
};

if(localStorage.getItem("theme")==="true"){
    document.body.classList.add("dark");
    document.getElementById("themeToggle").checked=true;
}

renderHabits();
renderHeatmap();
calculateStats();
