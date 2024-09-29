using AUTRA.FEM.Entities.BoundaryConditions.Constraints;
using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using MathNet.Spatial.Euclidean;

namespace AUTRA.FEM.Entities.Nodes
{
    public class Node3D : Node
    {
        
        public Vector3D Position { get; }

        public Node3D(int id, double x1, double x2, double x3, Constraint3D constraint, NodalForce3D force)
            : base(id, constraint, force)
        {
            Position = new Vector3D(x1, x2, x3);
        }
        public Node3D(int id, double x1, double x2, double x3, Constraint3D constraint)
            : base(id, constraint, new NodalForce3D())
        {
            Position = new Vector3D(x1, x2, x3);
        }
        public Node3D(int id, double x1, double x2, double x3, NodalForce3D force)
            : base(id, new Constraint3D(), force)
        {
            Position = new Vector3D(x1, x2, x3);
        }

        public Node3D(int id, double x1, double x2, double x3)
            :base(id, new Constraint3D(), new NodalForce3D())
        {
            Position = new Vector3D(x1, x2, x3); 
        }

        public override string ToString()
        {
            return $"Position: {Position}, Constraint: {Constraint}, NodalForce: {NodalForce}";
        }
    }
}



