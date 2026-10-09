import { onGrammarIngestDelete, onGrammarIngestGet, onGrammarIngestPost } from "../data/grammar-ingestion.js";

export async function onRequestGet(context) {
  return onGrammarIngestGet(context);
}

export async function onRequestPost(context) {
  return onGrammarIngestPost(context);
}

export async function onRequestDelete(context) {
  return onGrammarIngestDelete(context);
}
