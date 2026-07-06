/**
 * Ładuje zmienne środowiskowe PRZED importem modułów, które czytają `process.env`
 * na poziomie modułu (np. lib/pipedrive/client.ts). Importuj jako pierwszy:
 *   import "./load-env";
 */
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local" });
