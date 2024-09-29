using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Nodes;
using System.Collections.Generic;
using System.Linq;

namespace AUTRA.FEM.Entities.Geometries
{
    public class SkeletonGeometry : Geometry
    {
        #region Properties
        public List<LineElement> Elements { get; }
        public List<Node3D> Nodes { get; }
        public int NoNodes => Nodes.Count;
        public int NoElements => Elements.Count;
        #endregion

        #region Constructors
        public SkeletonGeometry(List<LineElement> eles, List<Node3D> nodes)
        {
            Elements = eles;
            Nodes = nodes;
        }
        #endregion


        #region Methods
        public Node3D GetNodeFromId(int id)
        {
            var res = Nodes.FirstOrDefault(n => n.Id == id);
            if (res == null)
            {
                throw new KeyNotFoundException($"Node with id {id} not found");
            }
            else
            {
                return res;
            }
        }

        public LineElement GetElementFromId(int id)
        {
            var res = Elements.FirstOrDefault(e => e.Id == id);
            if (res == null)
            {
                throw new KeyNotFoundException($"Element with id {id} not found");
            }
            else
            {
                return res;
            }
        }
        #endregion
    }
}
