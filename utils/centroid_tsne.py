from MulticoreTSNE import MulticoreTSNE as TSNE
import csv
import numpy as np
data = np.array(list(csv.reader(open('./centroids_subset.csv'))))
tsne = TSNE(n_jobs=4)
Y = tsne.fit_transform(data)

np.savetxt('tsne_output.csv', Y, delimiter=",")
