let video=document.querySelector("video");
let recordBtnCont=document.querySelector(".record-btn-cont");
let recordBtn=document.querySelector(".record-btn");
let captureBtnCont=document.querySelector(".capture-btn-cont");
let captureBtn=document.querySelector(".capture-btn");
let transparentColor="transparent";


let recordFlag=false;

let recorder;
let chunks=[]; // media data in chunks

let constraints = {
    video: true,
    audio: true
}

//navigator -> global object, provides browser info
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
        video.srcObject=stream;

        recorder=new MediaRecorder(stream);
        recorder.addEventListener("start",(e)=>{
            chunks=[];
        })
        recorder.addEventListener("dataavailable",(e)=>{
            chunks.push(e.data);
        })
        recorder.addEventListener("stop",(e)=>{
            // Conversion of media chunks to video
            let blob = new Blob(chunks,{type: "video/mp4"});
           
            if(db) {
                let videoID = shortid();
                let dbTransaction = db.transaction("video","readwrite");
                let videoStore= dbTransaction.objectStore("video");
                let videoEntry = {
                    id:`vid-${videoID}`,
                    blobData: blob
                }
                videoStore.add(videoEntry);
            }
            // let videoURL=URL.createObjectURL(blob);
            
            // let a=document.createElement("a");
            // a.href= videoURL;
            // a.download = "stream.mp4";
            // a.click(); 
        })
})

recordBtnCont.addEventListener("click",(e)=>{
    if(!recorder) return;

    recordFlag=!recordFlag;

    if(recordFlag){ //start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop();// stop
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
 })

captureBtnCont.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
  
    let tool=canvas.getContext('2d');
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    //Filtering
    tool.fillStyle=transparentColor;
    tool.fillRect(0,0,canvas.width, canvas.height);
   
    let image_data_url = canvas.toDataURL('image/jpeg');
     
    if(db) {
        let imageID = shortid();
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore= dbTransaction.objectStore("image");
        let imageEntry = {
            id:`img-${imageID}`,
            url:image_data_url
        }
        imageStore.add(imageEntry);
    }

setTimeout(()=> {
    captureBtn.classList.remove("scale-capture");
},500)
    // let a=document.createElement("a");
    // a.href= image_data_url;
    // a.download = "img.jpeg";
    // a.click();
})





let timerID;
let counter=0; //represents total seconds
let timer = document.querySelector(".timer");
 
function startTimer() {
    timer.style.display = "block";
    function displayTimer() {
        let totalseconds=counter;
        let hours = Number.parseInt(totalseconds/3600);
        totalseconds=totalseconds%3600;
        let minutes = Number.parseInt(totalseconds/60);
        let seconds =totalseconds%60;

        hours=(hours <10 )?`0${hours}`:`${hours}`;
        minutes=(minutes <10 )?`0${minutes}`:`${minutes}`;
        seconds=(seconds <10 )?`0${seconds}`:`${seconds}`;

        timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID=setInterval(displayTimer,1000);
 }

 function stopTimer(){
    timer.style.display = "none";
    clearInterval(timerID);
    counter=0;
    timer.innerText ="00:00:00";

 }

 //Filtering logic
 let filterLayer =document.querySelector(".filter-layer");
 let allFilters =document.querySelectorAll(".filter");
 allFilters.forEach(filterElem => {
    filterElem.addEventListener("click",(e)=>{
        transparentColor=getComputedStyle(filterElem).getPropertyValue('background-color');  
        filterLayer.style.backgroundColor=transparentColor;
    })
})



