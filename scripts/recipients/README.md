# Lista odbiorców pre-webinar

## Workflow (2 kroki)

```bash
# 1. Pobierz zapisanych z Pipedrive (lejek „Webinar”, cały pipeline)
npm run mail:pre:fetch

# 2. Sprawdź listę (dry-run, zero wysyłki)
npx tsx scripts/send-prewebinar.ts

# 3. Masowa wysyłka (ręcznie, z throttle)
npx tsx scripts/send-prewebinar.ts --send
```

Plik wyjściowy fetch: **`registrants.json`** (w tym katalogu).

## Format `registrants.json`

Po fetch:

```json
{
  "fetchedAt": "2026-07-01T12:00:00.000Z",
  "source": { "pipeline": "Webinar", "pipelineId": 123 },
  "count": 42,
  "recipients": [
    { "email": "jan.kowalski@example.com", "name": "Jan Kowalski" }
  ]
}
```

Loader akceptuje też prostsze formaty (ręczna edycja):

```json
[{ "email": "jan@example.com", "name": "Jan" }]
```

```json
["jan@example.com", "anna@example.com"]
```

## Inne komendy

```bash
npm run mail:pre:preview   # HTML → out/preview/prewebinar.html
npm run mail:pre:self      # test na karol.legut@euvic.pl
```

Flagi wysyłki: `--send`, `--self=`, `--only=`, `--limit=`, `--throttle-ms=2000`, `--no-autologin`, `--list=ścieżka/do/pliku.json`

Po wysyłce z błędami: **`send-failures.json`** (email, stage: `autologin` | `send`, komunikat błędu).

Przed prod: `SITE_URL=https://podpis-na-szkle.pl` w `.env`.
