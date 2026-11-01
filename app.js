const $ = (selector) => document.querySelector(selector);
$('#year').textContent = new Date().getFullYear();
const dialog = $('#detail-dialog');
function showDetail(title, paragraphs, label = 'INVESTIGATION NOTES / SIMULATED DATA') {
  $('#dialog-label').textContent = label;
  $('#dialog-title').textContent = title;
  const content = $('#dialog-content');
  content.replaceChildren();
  for (const [heading, text] of paragraphs) {
    const h = document.createElement('h3'); h.textContent = heading;
    const p = document.createElement('p'); p.textContent = text;
    content.append(h, p);
  }
  dialog.showModal();
}
$('.dialog-close').addEventListener('click', () => dialog.close());
$('.dialog-done').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog) {const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
const investigations = [
 ['Repeated authentication failures', [['Observation', 'The simulated host 192.0.2.24 generated 18 failed sign-in attempts for the same account within 60 seconds.'], ['What to investigate', 'Check the source, target account, timestamps, and whether a successful sign-in followed the failures. Compare the behavior with normal activity.'], ['Why context matters', 'Repeated failures can indicate a password attack, but a misconfigured service or an expired password may cause similar events. A signal is a starting point, not a verdict.']]],
 ['Scheduled system backup', [['Observation', 'A known backup service started at its expected scheduled time on the simulated host 192.0.2.10.'], ['Validation', 'Confirm the service identity, approved schedule, destination, and completion status against the baseline.'], ['Assessment', 'This example is marked expected because its identity and timing match the simulated baseline. Monitoring still applies.']]],
 ['Unusual outbound DNS volume', [['Observation', 'The simulated host 192.0.2.42 made a burst of DNS queries significantly above its usual baseline.'], ['What to investigate', 'Review destination domains, query length, record types, frequency, and the process responsible. Correlate with endpoint activity.'], ['Possible explanations', 'Potential causes include an application issue, a new workload, or suspicious communication. Additional evidence is required before classifying the event.']]],
 ['Signed application update', [['Observation', 'An application update with an expected publisher signature ran on the simulated host 192.0.2.18.'], ['Validation', 'Verify the signature chain, download source, file hash, and approved change window.'], ['Assessment', 'A valid signature is one useful signal; it does not independently establish that software is safe. This sample matches the expected update process.']]]
];
document.querySelectorAll('[data-event]').forEach(button => button.addEventListener('click', () => {const [title, paragraphs] = investigations[Number(button.dataset.event)];showDetail(title, paragraphs);}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-filter]').forEach(b => {const active = b === button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 let count=0;document.querySelectorAll('[data-event]').forEach(row => {row.hidden = button.dataset.filter !== 'all' && row.dataset.status !== button.dataset.filter;if(!row.hidden) count++;});
 $('#event-count').textContent=String(count).padStart(2,'0')+' EVENTS';
}));
const responses = {
 help:'Available commands:\n  whoami   — Meet Salman\n  focus    — Explore security interests\n  roadmap  — View planned certifications\n  lab      — Open the security lab\n  contact  — Contact information\n  clear    — Clear terminal output',
 whoami:'Salman Alshahri\nCybersecurity learner. Curious by design.',
 focus:'Threat detection / Network security / Digital forensics\nLearning to understand, investigate, and defend.',
 roadmap:'Planned learning roadmap — all coming soon:\neJPTv2 → Security+ → eCTHPv3 → eCIRv2 → eCDFP → THM SOC L1',
 contact:'Email: salmanm2a2@gmail.com\nLinkedIn: https://www.linkedin.com/in/salmanm2a/'
};
$('#terminal-form').addEventListener('submit', event => {
 event.preventDefault();const input=$('#command');const command=input.value.trim().toLowerCase();if(!command)return;
 const output=$('#terminal-output');input.value='';if(command==='clear'){output.replaceChildren();return;}
 const p=document.createElement('p');p.textContent='❯ '+command+'\n'+(command==='lab'?'Opening the security lab…':responses[command] || 'Command not found. Type help to see available commands.');output.append(p);while(output.childElementCount>12)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;
 if(command==='lab')$('#lab').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});


document.querySelectorAll('[data-cert]').forEach(button => button.addEventListener('click', () => {const card=button.closest('.cert-card');showDetail(card.querySelector('h3').textContent,[['Certification plan',card.querySelector('h4').textContent],['Learning focus',card.querySelector('p').textContent],['Status: Coming Soon','This is a planned learning goal. This certification has not been earned yet.']], 'LEARNING ROADMAP / '+String(Number(button.dataset.cert)+1).padStart(2,'0'));}));

// Observe a generous area around the artwork, without intercepting links or scrolling.
const shieldPanel = document.querySelector('.visual');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let shieldFrame = 0, pointerPosition = null;
function resetShield() {
 shieldPanel.classList.remove('is-tracking');
 for (const prop of ['--shield-x','--shield-y','--shift-x','--shift-y','--light-x','--light-y','--light-on']) shieldPanel.style.removeProperty(prop);
}
function moveShield() {
 shieldFrame = 0;
 if (!pointerPosition || motionPreference.matches) {resetShield();return;}
 const rect = shieldPanel.getBoundingClientRect();
 const {x,y} = pointerPosition;
 const reach = 110;
 if (x < rect.left-reach || x > rect.right+reach || y < rect.top-reach || y > rect.bottom+reach || rect.bottom < 0 || rect.top > innerHeight) {resetShield();return;}
 const clamp = value => Math.max(-1,Math.min(1,value));
 const dx = clamp((x-rect.left-rect.width/2)/(rect.width/2));
 const dy = clamp((y-rect.top-rect.height/2)/(rect.height/2));
 shieldPanel.classList.add('is-tracking');
 shieldPanel.style.setProperty('--shield-x',(-dy*10)+'deg');
 shieldPanel.style.setProperty('--shield-y',(dx*14)+'deg');
 shieldPanel.style.setProperty('--shift-x',(dx*9)+'px');
 shieldPanel.style.setProperty('--shift-y',(dy*7)+'px');
 shieldPanel.style.setProperty('--light-x',((dx+1)*50)+'%');
 shieldPanel.style.setProperty('--light-y',((dy+1)*50)+'%');
 shieldPanel.style.setProperty('--light-on','1');
}
document.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;pointerPosition={x:event.clientX,y:event.clientY};if(!shieldFrame)shieldFrame=requestAnimationFrame(moveShield);},{passive:true});
function leaveShield(){pointerPosition=null;resetShield();}
document.documentElement.addEventListener('pointerleave',leaveShield);
window.addEventListener('blur',leaveShield);
window.addEventListener('scroll',leaveShield,{passive:true});
motionPreference.addEventListener('change',leaveShield);
