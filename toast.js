function triggerToast(message){

    const existing=document.getElementById("custom-toast");
    if(existing) existing.remove();

    const toast=document.createElement("div");
    toast.id="custom-toast";
    toast.className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6 cursor-pointer transition-opacity duration-500";

    toast.innerHTML=`
        <div class="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-xs w-full">
            <p class="font-bold text-lg whitespace-pre-line">${message}</p>
            <p class="text-xs text-gray-400 mt-2">(터치로 닫기)</p>
        </div>
    `;

    const removeToast=()=>toast.remove();

    toast.addEventListener("click",removeToast);
    toast.addEventListener("touchstart",removeToast);

    document.body.appendChild(toast);

    setTimeout(()=>{
        if(document.body.contains(toast)){
            toast.style.opacity="0";
            setTimeout(removeToast,500);
        }
    },4500);

}