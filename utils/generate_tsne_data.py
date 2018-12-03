from MulticoreTSNE import MulticoreTSNE as TSNE
import numpy as np

data = np.loadtxt('pca.csv', delimiter=',')
tsne = TSNE(n_jobs=4)
Y = tsne.fit_transform(data)

np.savetxt('tsne_matrix.csv', Y, delimiter=",")
