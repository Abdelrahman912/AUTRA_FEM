using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Nodes;
using System.Collections.Generic;
using System.Linq;

namespace AUTRA.FEM.Entities.Geometries
{
    public class SkeletonGeometry : Geometry
    {
        #region Properties
        
        #endregion

        #region Constructors
        public SkeletonGeometry(List<LineElement> eles, List<Node3D> nodes)
            :base(eles.Cast<Element>().ToList(), nodes.Cast<Node>().ToList())
        {
           
        }
        #endregion


       
    }
}
