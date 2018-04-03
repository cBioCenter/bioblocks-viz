from MulticoreTSNE import MulticoreTSNE as TSNE
import csv
import numpy as np
import scipy.sparse

# csvData = genfromtxt('./centroids_full.csv', delimiter=',')
# arrays = np.array(csvData)
# data = np.transpose(arrays)

data = scipy.sparse.load_npz('counts_norm.npz')
data = data.toarray()

tsne = TSNE(n_jobs=4)
Y = tsne.fit_transform(data)

np.savetxt('tsne_output.csv', Y, delimiter=",")
