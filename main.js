(() => {

    let yOffset = 0;
    let prevScrollHeight = 0;
    let currentScene = 0;
    let enterNewScene=false;

    const sceneInfo = [
        {   
            //0
            type: 'sticky',
            heightNum: 1, //브라우저 높이의 5배로 scroll 할때 세팅
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity_in: [0, 1,{start:0.1, end:0.2}],
                messageB_opacity_in: [0, 1,{start:0.3, end:0.4}],
                messageC_opacity_in: [0, 1,{start:0.5, end:0.6}],
                messageD_opacity_in: [0, 1,{start:0.7, end:0.8}],
                messageA_opacity_out: [1, 0,{start:0.25, end:0.4}],
                messageB_opacity_out: [1, 0,{start:0.45, end:0.6}],
                messageC_opacity_out: [1, 0,{start:0.65, end:0.7}],
                messageD_opacity_out: [1, 0,{start:0.85, end:0.9}],
            }
        },
        {   
            //1
            type: 'normal',
            heightNum: 1, //브라우저 높이의 2배로 scroll 할때 세팅
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-1'),
               
            },
            values: {
               
            }
        },
        {   
            //2
            type: 'sticky',
            heightNum: 1, //브라우저 높이의 2배로 scroll 할때 세팅
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-2')
            },
            values: {
               
            }
        },
        {   
            //3
            type: 'sticky',
            heightNum: 1, //브라우저 높이의 2배로 scroll 할때 세팅
            scrollHeight: 0,
            objs:{
                container: document.querySelector('#scroll-section-3')
            },
            values: {
            }
        }
    ];

    function setLayout(){
        //각 스크롤 섹션의 높이 세팅
        for(let i=0;i<sceneInfo.length;i++){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }

        yOffset = window.pageYOffset;
        let totallScrollHeight = 0;
        for(let i=0; i< sceneInfo.length; i++){
            totallScrollHeight += sceneInfo[i].scrollHeight;
            if(totallScrollHeight>=yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id',`show-scene-${currentScene}`)
    }

    function calcValues(values, currentYOffset){
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        let scrollRatio = currentYOffset/scrollHeight;
        if(values.length==3){
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const parScrollHeight = partScrollEnd - partScrollStart;
            if(currentYOffset>=partScrollStart && currentYOffset<=partScrollEnd){
                rv = (currentYOffset - partScrollStart)/ parScrollHeight * (values[1]-values[0])+values[0];
            }else if(currentYOffset<partScrollStart){
                rv = values[0];
            }else if(currentYOffset>partScrollEnd){
                rv = values[1];
            }
        }else{
            rv = scrollRatio * (values[1]-values[0])+values[0];
        }

        return rv;    
    }

    function playAnimation(){
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight =sceneInfo[currentScene].scrollHeight;
        const scrollRatio = (yOffset-prevScrollHeight) / scrollHeight;
        
        switch(currentScene){
            
            case 0:
                const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);         
                const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);   
                const messageB_opacity_in = calcValues(values.messageB_opacity_in, currentYOffset);         
                const messageB_opacity_out = calcValues(values.messageB_opacity_out, currentYOffset);        
                const messageC_opacity_in = calcValues(values.messageC_opacity_in, currentYOffset);         
                const messageC_opacity_out = calcValues(values.messageC_opacity_out, currentYOffset);   
                const messageD_opacity_in = calcValues(values.messageD_opacity_in, currentYOffset);         
                const messageD_opacity_out = calcValues(values.messageD_opacity_out, currentYOffset);   

                if(scrollRatio <=0.22){
                    objs.messageA.style.opacity = messageA_opacity_in;
                }else{
                    objs.messageA.style.opacity = messageA_opacity_out;
                }
                if(scrollRatio <=0.42){
                    objs.messageB.style.opacity = messageB_opacity_in;
                }else{
                    objs.messageB.style.opacity = messageB_opacity_out;
                }
                if(scrollRatio <=0.62){
                    objs.messageC.style.opacity = messageC_opacity_in;
                }else{
                    objs.messageC.style.opacity = messageC_opacity_out;
                }
                if(scrollRatio <=0.82){
                    objs.messageD.style.opacity = messageD_opacity_in;
                }else{
                    objs.messageD.style.opacity = messageD_opacity_out;
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;    
        }    
    }

    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0;
        for(let i=0; i<currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            if(currentScene < sceneInfo.length-1){
                enterNewScene = true;
                currentScene++;
                document.body.setAttribute('id',`show-scene-${currentScene}`);
            }
        }
        if(yOffset < prevScrollHeight){
            enterNewScene = true;
            if(currentScene ===0) return;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if(enterNewScene) return;
        playAnimation();
    }

    window.addEventListener('scroll',() => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    window.addEventListener('load',setLayout);
    window.addEventListener('resize',setLayout);

    setLayout();

})();