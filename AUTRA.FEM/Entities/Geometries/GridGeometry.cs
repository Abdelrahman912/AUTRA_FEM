using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Nodes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AUTRA.FEM.Entities.Geometries
{
    public class GridGeometry : Geometry
    {
        public GridGeometry(List<Quadrilateral> els, List<Node2D> nodes) 
            : base(els.Cast<Element>().ToList(), nodes.Cast<Node>().ToList())
        {
        }
    }
}
