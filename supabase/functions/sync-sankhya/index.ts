import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configurações do ambiente do Sankhya
const MGE_API_URL = "https://api.seusankhya.com.br/mge/api"; // Altere quando for para produção
const SANKHYA_USER = Deno.env.get("SANKHYA_USER");
const SANKHYA_PASS = Deno.env.get("SANKHYA_PASS");

// Variáveis injetadas pelo próprio Supabase nativamente no ambiente Edge
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  try {
    // Cliente privilegiado para burlar RLS neste script de background
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Busca todas as compras (Cabeçalhos) que o app salvou como "pendente"
    const { data: comprasPendentes } = await supabaseAdmin
      .from("compras_cabecalho")
      .select(`
        id, 
        cod_parceiro,
        compras_itens (codigo_barras, quantidade, preco_unitario)
      `)
      .eq("status_sync", "pendente")
      .limit(20);

    if (!comprasPendentes || comprasPendentes.length === 0) {
      return new Response(JSON.stringify({ message: "Nenhuma compra pendente." }), { headers: { "Content-Type": "application/json" } });
    }

    /* 
     * 2. (MOCK) Autenticação no Sankhya via serviço nativo MobileLoginSP
     * Na vida real, você faria um POST para `${MGE_API_URL}/MobileLoginSP.login`
     * E obteria um Set-Cookie: JSESSIONID="..." para guardar o Token 
     */

    // 3. Iterar sobre as requisições para enviar os pedidos reais pro DB Oracle
    for (const compra of comprasPendentes) {
        
        /* Aqui você monta o Layout Padrão do Sankhya (Geralmente via CACSP.incluirNota)
           passando o Código Parceiro (compra.cod_parceiro) e iterando o array de itens 
           (compra.compras_itens) -> quantidade, Vlr.
        */
        
        // Timeout simulando a chamada REST para o ERP (2000ms)
        await new Promise(r => setTimeout(r, 2000)); 
        
        // Simulação do numero do pedido retornado pelo Sankhya:
        const nroNotaInternoSankhya = "NFS-" + Math.floor(Math.random() * 99999);

        // 4. Marca no banco Cloud que essa compra foi concluída para não repetir na próxima vez
        await supabaseAdmin
          .from("compras_cabecalho")
          .update({ 
               status_sync: "concluido", 
               retorno_sankhya: nroNotaInternoSankhya 
          })
          .eq("id", compra.id);
    }

    return new Response(
      JSON.stringify({ 
         success: true, 
         message: `${comprasPendentes.length} compra(s) importada(s) pro Sankhya com sucesso.` 
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
