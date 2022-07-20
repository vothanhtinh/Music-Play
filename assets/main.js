const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
//1.render playlist
//2. ScrollTtop
//3.Play/Pause/Stop
const app={
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    songs: [
        {
            name:'Vì Mẹ Anh Bắt Chia Tay',
            singer:'Miu Lê',
            path:'./assets/music/song1.mp3',
            image:'./assets/img/song1.jpg'
        },
        {
            name:'Ngày Khác Lạ',
            singer:'Đen, Triple D, Giang Pham ',
            path:'./assets/music/song2.mp3',
            image:'./assets/img/song2.jpg'
        },
        {
            name:'Một Ngàn Nỗi Đau',
            singer:'Văn Mai Hương, Hứa Kim Tuyền',
            path:'./assets/music/song3.mp3',
            image:'./assets/img/song3.jpg'
        },
        {
            name:'Hai Mươi Hai',
            singer:'Hứa Kim Tuyền,AMEE',
            path:'./assets/music/song4.mp3',
            image:'./assets/img/song4.jpg'
        },
        {
            name:'Đánh Mất Em',
            singer:'Quang Đăng Trần',
            path:'./assets/music/song5.mp3',
            image:'./assets/img/song5.jpg'
        },
        {
            name:'Cô Gái Vàng',
            singer:'HuyR, Tùng Viu',
            path:'./assets/music/song6.mp3',
            image:'./assets/img/song6.jpg'
        },
        {
            name:'Phận Duyên Lỡ Làng',
            singer:'Phát Huy T4,Trunz',
            path:'./assets/music/song7.mp3',
            image:'./assets/img/song7.jpg'
        },
        {
            name:'Cố Giang Tình',
            singer:'X2X',
            path:'./assets/music/song8.mp3',
            image:'./assets/img/song8.jpg'
        },
        {
            name:'Hãy Trao Cho Anh',
            singer:'Sơn Tùng M-TP, Snoop Dogg',
            path:'./assets/music/song9.mp3',
            image:'./assets/img/song9.jpg'
        },
        {
            name:'Remember Me',
            singer:'Sơn Tùng M-TP',
            path:'./assets/music/song10.mp3',
            image:'./assets/img/song10.jpg'
        }
    ],
    render: function(){
        const htmls=this.songs.map((song,index)=>{
            return `
            <div class="song ${index===this.currentIndex?'active':''} " data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                 <h3 class="title">${song.name}</h3>
                 <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                 <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
            `
        })
        playlist.innerHTML=htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this=this
        const cdWidth=cd.offsetWidth

        const cdTimeAnimate=cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000 ,//10s
            iterations:Infinity
        })
        cdTimeAnimate.pause();
        document.onscroll= function(){
           
            const scrollTop=window.scrollY||document.documentElement.scrollTop
            const NewWidth=cdWidth-scrollTop
            cd.style.width=(NewWidth>0)?NewWidth+"px" :0
            cd.style.opacity=NewWidth/cdWidth
        }
        //Xu lý   khi Playing
        playBtn.onclick=function(){
            if(_this.isPlaying){
                audio.pause()
             
            }
            else{
                audio.play()
            }
            
        }
        //khi song được player
        audio.onplay=function(){
            cdTimeAnimate.play()
            _this.isPlaying=true
            player.classList.add('playing')
        }
        //khi song bị pause
        audio.onpause=function(){
            cdTimeAnimate.pause()  
            _this.isPlaying=false
            player.classList.remove('playing')
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate=function(){
            if(audio.duration ){
                const progressPecent=Math.floor((audio.currentTime/audio.duration)*100)
                progress.value=progressPecent
                // audio.play()
            }
        }
        //Xu ly khi tua song
        progress.oninput=function(e){
            const seekTime=e.target.value/100*audio.duration
            audio.currentTime=seekTime
        }
        //khi next Song
        nextBtn.onclick=function(){ 
            if(_this.isRandom){
                _this.playRamdomSong()
            }else{
            _this.nextSong()
        }

            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Khi prev Songs
        prevBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRamdomSong()
            }else{
            _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xu li bat tat random song
        randomBtn.onclick=function(){
            _this.isRandom=!-_this.isRandom
            randomBtn.classList.toggle("active",_this.isRandom)
           
        }
        //Xử lí lặp lại bài hát
        repeatBtn.onclick=function(){
            _this.isRepeat=!_this.isRepeat;
            repeatBtn.classList.toggle("active",_this.isRepeat);
        }


        //Xử lí khi bài hát kết thúc
        audio.onended=function(){
            if(_this.isRepeat){
                audio.play();
            }else{
            nextBtn.click()
            }
        }
        //lắng nghe hành vi click vào playlist v
        playlist.onclick=function(e){
            const songNode=e.target.closest('.song:not(.active)')
            if(songNode|| e.target.closest('.option'))
            {
                 //Xử lí khi click vào song
                if(songNode){
                    _this.currentIndex=Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
                if(e.target.closest('.option')){

                }
            }
        }
    },
    loadCurrentSong:function(){
       
        heading.textContent=this.currentSong.name
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
        audio.src=this.currentSong.path
       
    },
    nextSong: function ()   {  
        this.currentIndex++
        if(this.currentIndex>=this.songs.length-1) {
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex<0) {
            this.currentIndex=this.songs.length
        }
        
        this.loadCurrentSong()
    },
    playRamdomSong: function(){
        let newIndex
        do{
            newIndex=Math.floor(Math.random()*this.songs.length)
        }while(this.currentIndex===newIndex);
        this.currentIndex=newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'center',
            });
        },250)
    },
    start: function(){
        //Định nghĩa các xử lí cho object
        this.defineProperties()
        //Lắng nghe các sự kiện ScrollTop
        this.handleEvents()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        //render playlist
        this.render()
    }
}
app.start()