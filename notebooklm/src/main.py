"""
NotebookLM automation client.

Usage:
  python src/main.py                   # list all notebooks
  python src/main.py --create "Title"  # create a notebook
  python src/main.py --chat NB_ID "Q" # chat with a notebook
"""

import argparse
import asyncio
import json
import os
import sys

from dotenv import load_dotenv

load_dotenv()


async def get_client():
    from notebooklm import NotebookLM

    auth_json = os.getenv("NOTEBOOKLM_AUTH_JSON")
    profile = os.getenv("NOTEBOOKLM_PROFILE")

    if auth_json:
        client = NotebookLM(auth=json.loads(auth_json), profile=profile or None)
    else:
        client = NotebookLM(profile=profile or None)

    return client


async def list_notebooks(client) -> None:
    notebooks = await client.list()
    if not notebooks:
        print("No notebooks found.")
        return
    for nb in notebooks:
        print(f"[{nb.id}] {nb.title}")


async def create_notebook(client, title: str) -> None:
    nb = await client.create(title=title)
    print(f"Created: [{nb.id}] {nb.title}")


async def add_source(client, notebook_id: str, url: str) -> None:
    nb = await client.get(notebook_id)
    source = await nb.add_source(url=url)
    print(f"Added source: {source.title or url}")


async def chat(client, notebook_id: str, question: str) -> None:
    nb = await client.get(notebook_id)
    response = await nb.chat(question)
    print(response.text)


async def main() -> None:
    parser = argparse.ArgumentParser(description="NotebookLM CLI client")
    parser.add_argument("--list", action="store_true", help="List all notebooks")
    parser.add_argument("--create", metavar="TITLE", help="Create a new notebook")
    parser.add_argument("--add-source", nargs=2, metavar=("NB_ID", "URL"), help="Add URL source to a notebook")
    parser.add_argument("--chat", nargs=2, metavar=("NB_ID", "QUESTION"), help="Chat with a notebook")
    args = parser.parse_args()

    client = await get_client()

    try:
        if args.create:
            await create_notebook(client, args.create)
        elif args.add_source:
            await add_source(client, args.add_source[0], args.add_source[1])
        elif args.chat:
            await chat(client, args.chat[0], args.chat[1])
        else:
            await list_notebooks(client)
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
