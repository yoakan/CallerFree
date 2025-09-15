
var startListenBtn ;
var stopListenBtn ;
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
        startListenBtn = $("#startListen");
        stopListenBtn = $("#stopListen");
        player = $("#player");
        micSelect = $("#micSelect");
        startListenBtn.on( "click", function() {
            if (mediaRecorder) {
                mediaRecorder.start();
                //running = true;
                
                console.log("Grabando...");
                $("#stopListen").show();
                $("#startListen").hide();
            }
            });
        $("#startListen").hide();
        stopListenBtn.on( "click", function() {
            if (mediaRecorder) {
                mediaRecorder.stop();
                
                //running = false;
                console.log("Grabación detenida.");
                $("#startListen").show();
                $("#stopListen").hide();
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
                    //player.src = audioUrl;
                    
                    
                    
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
        //console.log(`🔊 Se detecta energía en ${frecuenciaObjetivo} Hz`);
        if(  mediaRecorder.state === "inactive"){
            mediaRecorder.start();
        }
        
        spoke = true;
        
      } else {
        //console.log(`🤫 No se detecta en ${frecuenciaObjetivo} Hz`);
        if(spoke){
            
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
