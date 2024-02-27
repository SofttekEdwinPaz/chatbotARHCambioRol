import sys
import numpy as np

def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    dot_product = np.dot(vec1, vec2)
    magnitude = np.linalg.norm(vec1) * np.linalg.norm(vec2)
    if magnitude == 0:
        return 0
    return dot_product / magnitude

if __name__ == "__main__":
    embedding1 = np.fromstring(sys.argv[1], sep=',')
    embedding2 = np.fromstring(sys.argv[2], sep=',')
    similarity = cosine_similarity(embedding1, embedding2)
    print(similarity)
