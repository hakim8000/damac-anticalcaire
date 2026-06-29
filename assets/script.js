/* ============================================================
   Damac Énergie — Landing page (option B)
   1) Capture du GCLID (URL -> cookie 90 j -> champ caché)
   2) Consentement RGPD + Google Consent Mode v2
   3) Soumission du formulaire -> redirection vers merci.html
   ------------------------------------------------------------
   À CONFIGURER : voir les 2 constantes ci-dessous + le tag dans le <head> du HTML.
   ============================================================ */

// Endpoint = connecteur Apps Script (crée le lead Odoo avec le GCLID + alerte e-mail instantanée)
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbx6_3zuQB1ClDu_HpQQQwu4naeGpc6NjILEOkv2iq_aKuXy7g0ZsXszzl03z-bGbL7I/exec";
// >>> Optionnel : passe à false pour tester sans backend (redirige directement vers merci.html) <<<
const ENVOI_REEL = true;

/* ---------- 1) Capture des identifiants publicitaires ---------- */
function getParam(n){ return new URLSearchParams(window.location.search).get(n); }
function setCookie(n,v,jours){
  const d=new Date(); d.setTime(d.getTime()+jours*864e5);
  document.cookie = n+"="+encodeURIComponent(v)+";expires="+d.toUTCString()+";path=/;SameSite=Lax";
}
function getCookie(n){
  const m=document.cookie.match("(^|;)\\s*"+n+"\\s*=\\s*([^;]+)");
  return m ? decodeURIComponent(m.pop()) : "";
}
function captureClickIds(){
  ["gclid","gbraid","wbraid"].forEach(function(k){
    const v=getParam(k); if(v){ setCookie(k,v,90); }
  });
}
function fillHiddenFields(){
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val||""; };
  set("gclid",   getParam("gclid")   || getCookie("gclid"));
  set("gbraid",  getParam("gbraid")  || getCookie("gbraid"));
  set("wbraid",  getParam("wbraid")  || getCookie("wbraid"));
  set("utm_source",   getParam("utm_source"));
  set("utm_medium",   getParam("utm_medium"));
  set("utm_campaign", getParam("utm_campaign"));
  set("utm_term",     getParam("utm_term"));     // = mot-clé si {keyword} dans l'URL de tracking
  set("page_origine", window.location.href);
  set("referrer",     document.referrer);
}

/* ---------- 2) Consentement (Google Consent Mode v2) ---------- */
function appliquerConsentement(accord){
  if (typeof gtag === "function"){
    gtag('consent','update',{
      ad_storage:        accord ? 'granted':'denied',
      ad_user_data:      accord ? 'granted':'denied',
      ad_personalization:accord ? 'granted':'denied',
      analytics_storage: accord ? 'granted':'denied'
    });
  }
  // Microsoft Clarity : aligne le consentement (API consentv2 ; signal obligatoire en BE depuis le 31/10/2025)
  if (typeof clarity === "function"){
    clarity('consentv2', {
      ad_Storage:        accord ? 'granted':'denied',
      analytics_Storage: accord ? 'granted':'denied'
    });
  }
}
function gererBandeauCookies(){
  const choix = localStorage.getItem("damac_consent");
  const banniere = document.getElementById("cookie");
  if (choix === "granted"){ appliquerConsentement(true); return; }
  if (choix === "denied"){ appliquerConsentement(false); return; }
  if (banniere) banniere.style.display = "block";   // pas encore de choix
  const ok = document.getElementById("cookie-ok");
  const no = document.getElementById("cookie-no");
  if (ok) ok.onclick = function(){ localStorage.setItem("damac_consent","granted"); appliquerConsentement(true); banniere.style.display="none"; };
  if (no) no.onclick = function(){ localStorage.setItem("damac_consent","denied");  appliquerConsentement(false); banniere.style.display="none"; };
}

/* ---------- 3) Soumission du formulaire ---------- */
function gererFormulaire(){
  const form = document.getElementById("lead-form");
  if (!form) return;
  form.addEventListener("submit", function(e){
    e.preventDefault();
    const err = document.getElementById("form-err");
    const consent = document.getElementById("consent");
    if (consent && !consent.checked){
      if(err){ err.textContent="Merci d'accepter d'être recontacté(e) pour traiter votre demande."; err.style.display="block"; }
      return;
    }
    if(err) err.style.display="none";
    const produit = form.getAttribute("data-produit") || "";
    const destination = "merci.html?produit=" + encodeURIComponent(produit);

    if (!ENVOI_REEL){ window.location.href = destination; return; }

    // Apps Script lit e.parameter (form-urlencoded, PAS multipart) -> on convertit le FormData.
    // mode 'no-cors' : le Web App Apps Script ne renvoie pas d'en-têtes CORS ; la requête part
    // et crée le lead côté serveur, on ne lit pas la réponse (réponse opaque) -> on redirige.
    const payload = new URLSearchParams(new FormData(form));
    const btn = form.querySelector("button[type=submit]");
    if(btn){ btn.disabled=true; btn.textContent="Envoi en cours…"; }
    fetch(FORM_ENDPOINT, { method:"POST", mode:"no-cors", body:payload })
      .then(function(){ window.location.href = destination; })
      .catch(function(){
        if(err){ err.textContent="Une erreur est survenue. Appelez-nous au 0484 78 61 54 ou réessayez."; err.style.display="block"; }
        if(btn){ btn.disabled=false; btn.textContent="Recevoir mon devis gratuit"; }
      });
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", function(){
  captureClickIds();
  fillHiddenFields();
  gererBandeauCookies();
  gererFormulaire();
});
