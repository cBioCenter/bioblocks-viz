import scipy.sparse as ssp
import numpy as np
counts = ssp.load_npz('./counts_norm.npz')
np.savetxt('./counts_norm.csv', counts.todense(), delimiter=',', fmt='%.3f')
