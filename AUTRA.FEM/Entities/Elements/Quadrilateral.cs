using AUTRA.FEM.Entities.Nodes;

namespace AUTRA.FEM.Entities.Elements
{
    public class Quadrilateral : Element
    {
        #region Properties
        public Node2D  Node1 { get;  }
        public Node2D Node2 { get; }
        public Node2D Node3 { get; }
        public Node2D Node4 { get; }
        #endregion

        #region Constructors
        public Quadrilateral(int id, Node2D n1, Node2D n2, Node2D n3, Node2D n4)
            :base(id)
        {
            Node1 = n1;
            Node2 = n2;
            Node3 = n3;
            Node4 = n4;
        }
        #endregion

    }
}
