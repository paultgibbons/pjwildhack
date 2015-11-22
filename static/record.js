var audio_context;
var recorder;
function startUserMedia(stream) {
 var input = audio_context.createMediaStreamSource(stream);
 // Uncomment if you want the audio to feedback directly
 //input.connect(audio_context.destination);
 
 recorder = new Recorder(input);
}
function startRecording(button) {
 recorder && recorder.record();
 button.disabled = true;
 button.nextElementSibling.disabled = false;
}
function stopRecording(button) {
 document.getElementById('submit').disabled = false;
 recorder && recorder.stop();
 button.disabled = true;
 button.previousElementSibling.disabled = true;
 
 // create WAV download link using audio data blob
 createDownloadLink();
 
 recorder.clear();
}
function createDownloadLink() {
 recorder && recorder.exportWAV(function(blob) {
   var url = URL.createObjectURL(blob);
   var li = document.createElement('div');
   var au = document.createElement('audio');
   var hf = document.createElement('a');
   
   au.controls = true;
   au.src = url;
   hf.href = url;
   //document.getElementById('audio_url').value = url;
   global_url = url;
   hf.download = 'recording.wav';
   hf.innerHTML = hf.download;
   li.appendChild(au);
   li.appendChild(hf);
   recordingslist.appendChild(li);
 });
}
window.onload = function init() {
 try {
   // webkit shim
   window.AudioContext = window.AudioContext || window.webkitAudioContext;
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
   window.URL = window.URL || window.webkitURL;
   
   audio_context = new AudioContext;
 } catch (e) {
   alert('No web audio support in this browser!');
 }
 
 navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
 });
};