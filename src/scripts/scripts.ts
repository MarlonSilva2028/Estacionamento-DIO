interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null =>
     document.querySelector(query);

     function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
     }

     function patio() {
        function ler(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
     
        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function adicionar(veiculo: Veiculo, salva?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
              <td>${veiculo.nome.toUpperCase()}</td>
              <td>${veiculo.placa.toUpperCase()}</td>
              <td>${veiculo.entrada}</td>
              <td> 
                <button class="delete" data-placa="${veiculo.placa}">X</button>
              </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function () {
                remover(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);
            
            if (salva) salvar([...ler(), veiculo]);
        }

        function remover(placa : string){
          const { entrada, nome } = ler().find(
            veiculo => veiculo.placa === placa
          );

          const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
          
          if(
            !confirm(`O veículo modelo: ${nome.toUpperCase()} placa: ${placa.toUpperCase()} permaneceu no pátio por ${tempo.toUpperCase()}! Deseja confirmar a saída?`)
          )
          return;

          salvar(ler().filter((veiculo) => veiculo.placa !== placa));
          render();
        }

        function render(){
            $("#patio")!.innerHTML = '';
            const patio = ler();

            if(patio.length){
               patio.forEach((veiculo) => adicionar(veiculo));
               
            }
        }
      
        return {ler, adicionar, remover, render, salvar};
     }

     patio().render();

    $("#cadastrar")?.addEventListener('click', () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        console.log(nome, placa);

        if(!nome || !placa){
            alert("Os campos modelo e placa são obrigatórios!");
            return;
        }

        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true);
    });
})();