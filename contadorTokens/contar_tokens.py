import sys
import tiktoken

def contarTokensPython(filePath, modelo='gpt-3.5-turbo'):
    with open(filePath, 'r', encoding='utf-8') as file:
        texto = file.read()
    encoding = tiktoken.encoding_for_model(modelo)
    num_tokens = len(encoding.encode(texto))
    return num_tokens

if __name__ == "__main__":
    filePath = sys.argv[1]
    print(contarTokensPython(filePath))
