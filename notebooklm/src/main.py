"""
Entry point for the NotebookLM automation app.
Run `notebooklm login` once before using this.
"""

import asyncio
import notebooklm


async def run_example():
    async with notebooklm.AsyncClient() as client:
        # List existing notebooks
        notebooks = await client.notebooks.list()
        print(f"Found {len(notebooks)} notebook(s):")
        for nb in notebooks:
            print(f"  - {nb.title} ({nb.id})")

        # Uncomment to create a new notebook and add a source:
        # nb = await client.notebooks.create("My Research")
        # await client.sources.add_url(nb.id, "https://example.com/article")
        # response = await client.chat(nb.id, "Summarize the key points")
        # print(response.text)


def main():
    asyncio.run(run_example())


if __name__ == "__main__":
    main()
