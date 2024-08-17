# Spanning Trees on a Lattice

This repository contains the Mathematica notebooks for 

---

## Counting the Spanning Trees on a Lattice

This code is based on the Matrix Tree Theorem of Kirchhoff, which states that given a connected graph (of which the lattice we consider is also an example), the number of spanning trees of the graph is given by any cofactor of the Laplacian matrix for the graph.

The Laplacian Matrix of a graph is given as 
$$
    Q = D - A
$$
where $D$ is the degree matrix, which is a diagonal matrix stating how many connections start or end at the $i^{th}$ node, and $A = \{a_{ij}\}$ is the adjacency matrix, which is valued $a_{ij} =1$ if $i^{th}$ and $j^{th}$ nodes have a connection between them, and 0 otherwise.

[countingTrees.nb](countingTrees.nb) ([countingTrees.pdf](countingTrees.pdf)) contains the Mathematica code counting the number of spanning trees on an arbitrary hypercubic lattice.

---

## Enumerating the Spanning Trees on a Lattice

[enumerateAllTrees.nb](enumerateAllTrees.nb) ([enumereAllTrees.pdf](enumerateAllTrees.pdf)) contains the Mathematica implementation of the following pseudocode for enumerating all spanning trees on an arbitrary hypercubic lattice.

```mathematica
tree = collection of the spanning tree, visited sites, checked sites, along with the information if the spanning tree is completed or not.

While there is atleast one incomplete tree in the set of trees:
    For each tree in the set of trees:
        For all sites in the tree:
            If the site is not already checked:
                Add the neighbors that are not in the tree to the possible neighbors set
            For each combination of the possible neighbors:
                Create a copy of the current tree and add the new links to the tree
                Add the said neighbors to the visited set of the tree
                If all the sites in the lattice belong to the visited set:
                    Mark the tree as completed
                Append the new tree to the set of new trees
    Delete duplicates from the set trees
    Replace the current set of trees with the set of new trees
```

---

## Getting Gauge Transformation between two Spanning Trees on a Lattice

[gaugeTransformation.nb](gaugeTransformation.nb) ([gaugeTransformation.pdf](gaugeTransformation.pdf)) contains the Mathematica code, based on the following pseudocode, for obtaining the local gauge transformation needed to transform a given spanning tree into another spanning tree.

```mathematica
modifiedLinks = the links of the gauge transformed lattice, set according to the first tree
toAdd = tree2 - tree1; i.e. the set of links in tree2 and not in tree1, and therefore to be added to tree1
gaugeTransformation = I; initialise the gauge transformation to the identity.
equalityConstraints = for a given site, gives the list of sites to be modified to preserve the unchanged links in the tree.

For every link in toAdd:
    Set the second site of the link to the value of the link and the first site to I to add the link to the tree.
    For every site in equalityConstraints[second site]:
        multiply the existing gauge element at the site by the link element to preserve the unchanged links
```

---

>The file [Trees_3_2.mx](Trees_3_2.mx) contains the dump of Mathematica evaluation of all the spanning trees on a 3x3 lattice, and the file [neighbours_3_2.mx](neighbours_3_2.mx) contains the dump of the details of neighbors of each vertex on the 3x3 lattice (with periodic boundary conditions).