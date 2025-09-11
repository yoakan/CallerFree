
var startBtn ;
var stopBtn ;
var player ;
var micSelect;
let mediaRecorder;
let analyser, dataArray, hzPerBin;
let audioChunks = [];
const lvlMinVoice = 15;
let running = false;
let spoke = false;
const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResult = false;

$( document ).ready(function() {
        startBtn = $("#btnStart");
        stopBtn = $("#btnStop");
        player = $("#player");
        micSelect = $("#micSelect");
        startBtn.on( "click", function() {
            if (mediaRecorder) {
                mediaRecorder.start();
                //running = true;
                startBtn.disabled = true;
                stopBtn.disabled = false;
                
                console.log("Grabando...");
            }
            });

        stopBtn.on( "click", function() {
            if (mediaRecorder) {
                mediaRecorder.stop();
                startBtn.disabled = false;
                stopBtn.disabled = true;
                //running = false;
                console.log("Grabación detenida.");
            
            }
            
        });

        navigator.mediaDevices.getUserMedia({ audio: true }).then(loadMics);
        navigator.mediaDevices.ondevicechange = loadMics; 


        // Pedir acceso al micrófono
        async function initRecorder() {
            try {
                let deviceId = micSelect.value;
                const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: deviceId ? { exact: deviceId } : undefined } });
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    player.src = audioUrl;
                    
                    /*const a = document.createElement("a");
                    a.href = URL.createObjectURL(new Blob(audioChunks, { type: "audio/webm" }));
                    a.download = "mi_grabacion.webm"; // nombre del archivo
                    a.click();*/
                    
                    //speaker(audioUrl)
                        
                    sendVoice(audioBlob);
                    audioChunks = [];
                
                };
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioCtx.createMediaStreamSource(stream);

                analyser = audioCtx.createAnalyser();
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                hzPerBin = audioCtx.sampleRate / analyser.fftSize;

                source.connect(analyser);
                checkFrequency();
            } catch (err) {
                console.error("Error al acceder al micrófono:", err);
            }
        }

        initRecorder();
        
    }
)

function checkFrequency() {
      //if (!running) return;

      analyser.getByteFrequencyData(dataArray);

      const frecuenciaObjetivo = 5000; // Hz (ejemplo: 5 kHz)
      const binIndex = Math.floor(frecuenciaObjetivo / hzPerBin);
      const nivel = dataArray[binIndex];

      if (nivel > lvlMinVoice) {
        console.log(`🔊 Se detecta energía en ${frecuenciaObjetivo} Hz`);
        if(  mediaRecorder.state === "inactive"){
            mediaRecorder.start();
        }
        
        spoke = true;
        
      } else {
        console.log(`🤫 No se detecta en ${frecuenciaObjetivo} Hz`);
        if(spoke){
            
            //let audioBlobSpeak = new Blob(audioChunks, { type: "audio/webm" });
            //let src = URL.createObjectURL(audioBlobSpeak);
            //speaker(src)
            spoke = false;
            setTimeout(function(){
            mediaRecorder.stop();
            },500)
        }
        //audioChunks=[];
      }

      requestAnimationFrame(checkFrequency);
}
async function loadMics() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(d => d.kind === "audioinput");
      micSelect.innerHTML = "";
      mics.forEach(mic => {
        const option = document.createElement("option");
        option.value = mic.deviceId;
        option.textContent = mic.label || `Micrófono ${mic.deviceId}`;
        micSelect.append(option);
      });
    }
