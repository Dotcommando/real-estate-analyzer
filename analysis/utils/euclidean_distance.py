import numpy as np


def euclidean_distance(p1, p2):
    return np.sqrt((p1['lat'] - p2['lat'])**2 + (p1['lng'] - p2['lng'])**2)
