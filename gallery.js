setTimeout(()=>{

if(db) {
// videos retrieval


let dbTransaction= db.transaction("video","readonly");
let videoStore=dbTransaction.objectStore("video");
let videoRequest = videoStore.getAll(); // Event driven
videoRequest.onsuccess = (e) =>{
    let videoResult=videoRequest.result;
    let galleryCont=document.querySelector(".gallery-cont");
        videoResult.forEach(videoObj => {
        let mediaElem= document.createElement("div");
        mediaElem.setAttribute("class","media-cont");
        mediaElem.setAttribute("id",videoObj.id);
        let url=URL.createObjectURL(videoObj.blobData);

        mediaElem.innerHTML=` 
            <div class="media">
                     <video autoplay loop src="${url}"></video>
            </div>
            <div class="delete action-btn">DELETE</div>
            <div class="download action-btn">DOWNLOAD</div>
            `;
            galleryCont.appendChild(mediaElem);
            
            //Listeners
            let deleteBtn=mediaElem.querySelector(".delete");
            deleteBtn.addEventListener("click",deleteListener);
            let downloadBtn=mediaElem.querySelector(".download");
            downloadBtn.addEventListener("click",downloadListener);

    })
}
//images retrieval
let dbTransaction1= db.transaction("image","readonly");
let imageStore=dbTransaction1.objectStore("image");
let imageRequest = imageStore.getAll(); // Event driven
imageRequest.onsuccess = (e) =>{
    let imageResult=imageRequest.result;
    let galleryCont=document.querySelector(".gallery-cont");
    imageResult.forEach(imageObj => {
        let mediaElem= document.createElement("div");
        mediaElem.setAttribute("class","media-cont");
        mediaElem.setAttribute("id",imageObj.id);
        let url=imageObj.url;

        mediaElem.innerHTML=` 
            <div class="media">
                     <img src="${url}" />
            </div>
            <div class="delete action-btn">DELETE</div>
            <div class="download action-btn">DOWNLOAD</div>
            `;
            galleryCont.appendChild(mediaElem);

            //Listeners
            let deleteBtn=mediaElem.querySelector(".delete");
            deleteBtn.addEventListener("click",deleteListener);
            let downloadBtn=mediaElem.querySelector(".download");
            downloadBtn.addEventListener("click",downloadListener);
            
    })
}

}

},100)

//UI removal, DB remove
function deleteListener(e){
    //DB removal
 let id=e.target.parentElement.getAttribute("id");
 if(id.slice(0,3) === "vid"){
    let dbTransaction= db.transaction("video","readwrite");
    let videoStore=dbTransaction.objectStore("video");
    videoStore.delete(id);
 }else{
    let dbTransaction1= db.transaction("image","readwrite");
    let imageStore=dbTransaction1.objectStore("image");
    imageStore.delete(id);
 }

//UI removal 
e.target.parentElement.remove();

}

function downloadListener(e){
    let id=e.target.parentElement.getAttribute("id");
    let type=id.slice(0,3)
    if(type === "vid"){
        let dbTransaction= db.transaction("video","readwrite");
        let videoStore=dbTransaction.objectStore("video");
        let videoRequest=videoStore.get(id);
        videoRequest.onsuccess=(e) =>{
            let videoResult=videoRequest.result;

            let videoURL =URL.createObjectURL(videoResult.blobData);

            a=document.createElement("a");
            a.href= videoURL;
            a.download = "img.jpeg";
            a.click();
        }
        
    }else{
        let dbTransaction1= db.transaction("video","readwrite");
        let imageStore=dbTransaction1.objectStore("video");
        let imageRequest=imageStore.get(id);
        imageRequest.onsuccess=(e) =>{
            let imageResult=imageRequest.result;
            
            let image_data_url=imageResult.url;
            a=document.createElement("a");
            a.href= image_data_url;
            a.download = "img.jpeg";
            a.click();
        }
     }

}