using AUTRA.FEM.Entities.Nodes;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.Elements
{
    public class Quadrilateral : Element
    {

        #region private fileds
        private Lazy<List<Vector2D>> _coords;
        #endregion

        #region Properties

        public Node2D  Node1 { get;  }
        public Node2D Node2 { get; }
        public Node2D Node3 { get; }
        public Node2D Node4 { get; }

        public List<Vector2D> Coordinates => _coords.Value;

        #endregion

        #region Constructors
        public Quadrilateral(int id, Node2D n1, Node2D n2, Node2D n3, Node2D n4)
            :base(id)
        {
            Node1 = n1;
            Node2 = n2;
            Node3 = n3;
            Node4 = n4;
            _coords = new Lazy<List<Vector2D>>(CalculateCoordinates);
        }
        #endregion

        #region Methods

        public List<Vector2D> CalculateCoordinates()
        {
            var coords = new List<Vector2D>
            {
                Node1.Position,
                Node2.Position,
                Node3.Position,
                Node4.Position
            };
            return coords;
        }

        #endregion

    }
}
