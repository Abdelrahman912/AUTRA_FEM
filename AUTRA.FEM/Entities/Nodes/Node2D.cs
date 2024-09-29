using AUTRA.FEM.Entities.BoundaryConditions.Constraints;
using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using MathNet.Spatial.Euclidean;

namespace AUTRA.FEM.Entities.Nodes
{
    public class Node2D: Node
    {
        public Vector2D Position { get; }

        public Node2D(int id, double x1, double x2, Constraint2D constraint, NodalForce2D force)
            : base(id, constraint, force)
        {
            Position = new Vector2D(x1, x2);
        }
        public Node2D(int id, double x1, double x2, double x3, Constraint2D constraint)
            : base(id, constraint, new NodalForce2D())
        {
            Position = new Vector2D(x1, x2);
        }
        public Node2D(int id, double x1, double x2, NodalForce2D force)
            : base(id, new Constraint2D(), force)
        {
            Position = new Vector2D(x1, x2);
        }

        public Node2D(int id, double x1, double x2)
            : base(id, new Constraint2D(), new NodalForce2D())
        {
            Position = new Vector2D(x1, x2);
        }

        public override string ToString()
        {
            return $"Position: {Position}, Constraint: {Constraint}, NodalForce: {NodalForce}";
        }
    }
}
