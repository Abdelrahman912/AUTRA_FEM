using AUTRA.FEM.Entities.ConstitutiveLaw;
using AUTRA.FEM.Entities.Nodes;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AUTRA.FEM.Entities.Elements
{
    public class Quadrilateral : Element
    {

        #region private fileds
        private readonly Lazy<List<Vector2D>> _coords;
        private readonly ConstitutiveLaw2D _law;
        #endregion

        #region Properties
        public double E { get; }
        public double v { get; }
        public double h { get; } // thickness

        public List<Vector2D> Coordinates => _coords.Value;

        public Matrix<double> C => _law.C;

        public override List<Node> Nodes { get; }

        #endregion

        #region Constructors
        public Quadrilateral(int id, List<Node2D> nodes,double h, ConstitutiveLaw2D law)
            :base(id)
        {
            Nodes = nodes.Cast<Node>().ToList();
            this.h = h;
            this.E = E;
            this.v = v;
            _law = law;
            _coords = new Lazy<List<Vector2D>>(CalculateCoordinates);
        }
        #endregion

        #region Methods

        public List<Vector2D> CalculateCoordinates()
        {
            var coords = Nodes.Cast<Node2D>().Select(n => n.Position).ToList();
            return coords;
        }

        #endregion

    }
}
