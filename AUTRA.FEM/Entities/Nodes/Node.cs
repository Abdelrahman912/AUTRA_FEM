using AUTRA.FEM.Entities.BoundaryConditions.Constraints;
using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.Nodes
{
    public abstract class Node
    {
        public int Id { get; }
        public Constraint Constraint { get; }
        public NodalForce NodalForce { get; }
        public Node(int id, Constraint constraint, NodalForce force)
        {
            Id = id;
            Constraint = constraint;
            NodalForce = force;
        }
    }
}
