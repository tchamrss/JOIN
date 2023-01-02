
window.onscroll = function() {
    
    if(document.getElementById('wrapperHelp').clientHeight >= 700){
        document.body.classList.add('scrollable');

    }else{
        document.body.classList.remove('scrollable');

    }
}