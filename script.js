
let dati = JSON.parse(localStorage.getItem('frasi_libri') || '[]');
let modificaIndice = -1;

const form = document.getElementById('form');
const lista = document.getElementById('lista');

form.onsubmit = e => {
  e.preventDefault();
  const record = {
    frase: form.frase.value,
    libro: form.libro.value,
    autore: form.autore.value,
    capitolo: form.capitolo.value,
    paragrafo: form.paragrafo.value,
    tags: form.tags.value
  };
  if (modificaIndice >= 0) {
    dati[modificaIndice] = record;
    modificaIndice = -1;
  } else {
    dati.push(record);
  }
  salva();
  form.reset();
};

function salva() {
  localStorage.setItem('frasi_libri', JSON.stringify(dati));
  mostra();
}

function mostra() {
  lista.innerHTML = '';
  const ff = i => document.getElementById(i).value.toLowerCase();
  const filtrati = dati.filter(f =>
    f.frase.toLowerCase().includes(ff('filtroFrase')) &&
    f.libro.toLowerCase().includes(ff('filtroLibro')) &&
    f.autore.toLowerCase().includes(ff('filtroAutore')) &&
    f.capitolo.toLowerCase().includes(ff('filtroCapitolo')) &&
    f.paragrafo.toLowerCase().includes(ff('filtroParagrafo')) &&
    f.tags.toLowerCase().includes(ff('filtroTags'))
  );
  filtrati.forEach((f, i) => {
    const div = document.createElement('div');
    div.className = 'quote';
    div.innerHTML = `
      <blockquote>“${f.frase}”</blockquote>
      <small>${f.autore}, <em>${f.libro}</em></small>
      <div class="tags">Capitolo: ${f.capitolo || '-'}, Paragrafo: ${f.paragrafo || '-'}</div>
      <div class="tags">Tag: ${f.tags}</div>
      <div class="actions">
        <button onclick="modifica(${i})">Modifica</button>
        <button onclick="elimina(${i})">Elimina</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function modifica(i) {
  const f = dati[i];
  form.frase.value = f.frase;
  form.libro.value = f.libro;
  form.autore.value = f.autore;
  form.capitolo.value = f.capitolo;
  form.paragrafo.value = f.paragrafo;
  form.tags.value = f.tags;
  modificaIndice = i;
  window.scrollTo(0, 0);
}

function elimina(i) {
  if (confirm('Eliminare questa frase?')) {
    dati.splice(i, 1);
    salva();
  }
}

function esporta() {
  let csv = 'Frase,Libro,Autore,Capitolo,Paragrafo,Tag\n';
  dati.forEach(f => {
    csv += `"${f.frase.replace(/"/g, '""')}","${f.libro}","${f.autore}","${f.capitolo}","${f.paragrafo}","${f.tags}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'frasi.csv';
  link.click();
}

document.querySelectorAll('.filters input').forEach(input => input.oninput = mostra);

mostra();
