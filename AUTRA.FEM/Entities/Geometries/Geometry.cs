using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Nodes;
using System.Collections.Generic;
using System.Linq;

namespace AUTRA.FEM.Entities.Geometries
{
    public abstract class Geometry
    {

        #region Properties

        public List<Element> Elements { get; }
        public List<Node> Nodes { get; }
        public int NoNodes => Nodes.Count;
        public int NoElements => Elements.Count;

        #endregion

        #region Constructors

        protected Geometry(List<Element> els, List<Node> nodes)
        {
            Elements = els;
            Nodes = nodes;
        }

        #endregion


        #region Methods
        public Node GetNodeFromId(int id)
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

        public Element GetElementFromId(int id)
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
