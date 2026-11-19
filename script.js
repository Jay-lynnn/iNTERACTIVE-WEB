const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---- mobile menu ---- */
const burger = $('.burger');
const menu = $('#menu');
const setMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
};
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });

/* ---- highlight the nav link for the section on screen ---- */
const links = $$('#menu a');
const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) {
            links.forEach((a) => a.classList.toggle('active', a.hash === '#' + en.target.id));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => io.observe(s));

/* ---- terminal ---- */
const out = $('#out');
const input = $('#cmd');

const say = (text, cls) => {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    out.append(p);
    out.scrollTop = out.scrollHeight;
};

const commands = {
    help: () => 'try: whoami, skills, projects, contact, flag, clear',
    whoami: () => 'hillary jesslyn brilliano. cybersecurity student in jakarta. ctf player, linux fan.',
    skills: () => 'python, bash, linux, nmap, wireshark, burp suite',
    projects: () => 'ctf writeups & labs | network traffic analyzer | this portfolio',
    contact: () => 'h.jesslyn31@gmail.com',
    flag: () => 'there is a real one on this page. view the source and look closely.',
    ls: () => 'about  projects  skills  contact',
};

function run(raw) {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    say('$ ' + c, 'cmd');
    if (c === 'clear') { out.innerHTML = ''; return; }
    if (c.startsWith('sudo')) { say('nice try.'); return; }
    if (commands[c]) say(commands[c]());
    else say(`command not found: ${c}. type "help".`, 'dim');
}

$('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
});
$('#term').addEventListener('click', (e) => { if (e.target.tagName !== 'BUTTON') input.focus(); });
$$('[data-run]').forEach((b) => b.addEventListener('click', () => run(b.dataset.run)));

// intro: type "whoami" once, then run it
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro = () => {
    run('whoami');
    say('type "help" to see what else it does.', 'dim');
};
if (reduced) {
    intro();
} else {
    let i = 0;
    const word = 'whoami';
    const t = setInterval(() => {
        input.value = word.slice(0, ++i);
        if (i === word.length) {
            clearInterval(t);
            setTimeout(() => { input.value = ''; intro(); }, 350);
        }
    }, 110);
}

/* ---- project filters ---- */
$$('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
        $$('.chip').forEach((c) => c.setAttribute('aria-pressed', c === chip));
        const f = chip.dataset.f;
        $$('.project').forEach((p) => {
            p.hidden = !(f === 'all' || p.dataset.cat.split(' ').includes(f));
        });
    });
});

/* ---- project accordion (works on touch, unlike hover) ---- */
$$('.card-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !open);
        btn.nextElementSibling.classList.toggle('open', !open);
    });
});

/* ---- copy email ---- */
$$('.copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(btn.dataset.copy);
            btn.textContent = 'Copied';
        } catch {
            btn.textContent = 'Press Ctrl+C';
        }
        setTimeout(() => (btn.textContent = 'Copy'), 1600);
    });
});

/* ---- ROT13 mini challenge ---- */
const rot = $('#rot');
const rotmsg = $('#rotmsg');
rot.addEventListener('input', () => {
    const v = rot.value.trim().toLowerCase();
    if (v === 'contact me') {
        rotmsg.innerHTML = 'Correct, that was ROT13. <a href="#contact">Go ahead and contact me.</a>';
    } else {
        rotmsg.textContent = v ? 'Not yet. Hint: shift each letter 13 places.' : "Hint: it's a Caesar shift of 13.";
    }
});
